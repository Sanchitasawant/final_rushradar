import os
import pickle
from datetime import datetime, timedelta

import pandas as pd
from django.contrib.auth import get_user_model
from django.db.models import Count, Max, Q
from django.db.models.functions import ExtractHour, TruncDate
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from weather.weather_service import get_weather
from .models import PredictionHistory, Visitor
from .serializers import PredictionHistorySerializer, VisitorSerializer


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "../crowd_model.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "../encoders.pkl")
TARGET_ENCODER_PATH = os.path.join(BASE_DIR, "../target_encoder.pkl")
DATASET_PATH = os.path.join(BASE_DIR, "../dataset/train_crowd_data.csv")

model = pickle.load(open(MODEL_PATH, "rb"))
encoders = pickle.load(open(ENCODER_PATH, "rb"))
target_encoder = pickle.load(open(TARGET_ENCODER_PATH, "rb"))
User = get_user_model()


@api_view(["POST"])
def predict_crowd(request):
    try:
        train = request.data.get("train")
        station = request.data.get("station")
        day = request.data.get("day")

        if not train or not station or not day:
            return Response({"error": "Missing input values"})

        weather = get_weather(station)
        train_encoded = encoders["train"].transform([train])[0]
        station_encoded = encoders["station"].transform([station])[0]
        day_encoded = encoders["day"].transform([day])[0]
        weather_encoded = encoders["weather"].transform([weather])[0]
        prediction = model.predict([[train_encoded, station_encoded, day_encoded, weather_encoded]])
        crowd = target_encoder.inverse_transform(prediction)[0]

        suggestion = None
        if os.path.exists(DATASET_PATH):
            df = pd.read_csv(DATASET_PATH)
            station_trains = df[df["station"] == station].copy()
            station_trains = station_trains[station_trains["train"] != train]

            if not station_trains.empty:
                station_trains["time_obj"] = pd.to_datetime(station_trains["time"], format="%H:%M")
                now = datetime.now()
                current_time_obj = pd.to_datetime(now.strftime("%H:%M"), format="%H:%M")
                future_trains = station_trains[station_trains["time_obj"] > current_time_obj]

                if not future_trains.empty:
                    priority_map = {"LOW": 1, "MEDIUM": 2, "HIGH": 3}
                    future_trains["priority"] = future_trains["crowd"].map(priority_map)
                    future_trains = future_trains.sort_values(["priority", "time_obj"])
                    best_train = future_trains.iloc[0]
                    train_time = datetime.strptime(best_train["time"], "%H:%M")
                    train_time_today = now.replace(
                        hour=train_time.hour,
                        minute=train_time.minute,
                        second=0,
                        microsecond=0,
                    )
                    minutes_left = int((train_time_today - now).total_seconds() / 60)
                    if minutes_left < 0:
                        minutes_left = 0

                    suggestion = {
                        "train": best_train["train"],
                        "time": best_train["time"],
                        "crowd": best_train["crowd"],
                        "minutes_left": minutes_left,
                    }

        PredictionHistory.objects.create(
            user=request.user if request.user.is_authenticated else None,
            station=str(station),
            train=str(train),
            weather=str(weather),
            day=str(day),
            predicted_crowd=str(crowd),
        )

        return Response(
            {
                "train": train,
                "station": station,
                "weather": weather,
                "predicted_crowd": crowd,
                "suggested_train": suggestion,
            }
        )
    except Exception as e:
        return Response({"error": str(e)})


@api_view(["GET"])
def crowd_stats(request):
    try:
        if not os.path.exists(DATASET_PATH):
            return Response({"error": "Dataset not found"})

        df = pd.read_csv(DATASET_PATH)
        stations = df["station"].unique()
        station_names = []
        crowd_values = []

        for st in stations:
            station_rows = df[df["station"] == st]
            high = len(station_rows[station_rows["crowd"] == "HIGH"])
            medium = len(station_rows[station_rows["crowd"] == "MEDIUM"])
            low = len(station_rows[station_rows["crowd"] == "LOW"])
            crowd_score = (high * 3) + (medium * 2) + (low * 1)
            station_names.append(st)
            crowd_values.append(int(crowd_score))

        return Response({"stations": station_names, "crowd": crowd_values})
    except Exception as e:
        return Response({"error": str(e)})


@api_view(["GET"])
def stations_list(request):
    try:
        if not os.path.exists(DATASET_PATH):
            return Response({"error": "Dataset not found"})
        df = pd.read_csv(DATASET_PATH)
        stations = sorted(df["station"].dropna().unique())
        return Response({"stations": stations})
    except Exception as e:
        return Response({"error": str(e)})


@api_view(["GET"])
def peak_hours(request):
    try:
        if not os.path.exists(DATASET_PATH):
            return Response({"error": "Dataset not found"})
        df = pd.read_csv(DATASET_PATH)
        peak_times = df["time"].value_counts().sort_values(ascending=False).head(5)
        return Response({"times": list(peak_times.index), "counts": [int(x) for x in peak_times.values]})
    except Exception as e:
        return Response({"error": str(e)})


@api_view(["GET"])
def timetable(request):
    try:
        if not os.path.exists(DATASET_PATH):
            return Response({"error": "Dataset not found"})

        station = request.GET.get("station")
        df = pd.read_csv(DATASET_PATH)
        if station:
            df = df[df["station"] == station]

        df["time_obj"] = pd.to_datetime(df["time"], format="%H:%M")
        df = df.sort_values("time_obj")
        df["time"] = df["time_obj"].dt.strftime("%I:%M %p")
        return Response(df[["train", "station", "time"]].to_dict(orient="records"))
    except Exception as e:
        return Response({"error": str(e)})


@api_view(["GET"])
@permission_classes([IsAdminUser])
def analytics_overview(request):
    now = timezone.now()
    active_since = now - timedelta(minutes=5)
    peak_row = (
        PredictionHistory.objects.annotate(hour=ExtractHour("created_at"))
        .values("hour")
        .annotate(total=Count("id"))
        .order_by("-total")
        .first()
    )

    return Response(
        {
            "total_users": User.objects.count(),
            "total_predictions": PredictionHistory.objects.count(),
            "total_visitors": Visitor.objects.count(),
            "unique_visitors": Visitor.objects.values("session_key").distinct().count(),
            "active_users": Visitor.objects.filter(visited_at__gte=active_since).values("session_key").distinct().count(),
            "peak_crowd_time": f"{peak_row['hour']:02d}:00" if peak_row and peak_row["hour"] is not None else "N/A",
            "last_prediction_at": PredictionHistory.objects.aggregate(last=Max("created_at"))["last"],
        }
    )


@api_view(["GET"])
@permission_classes([IsAdminUser])
def crowd_distribution_analytics(request):
    return Response(
        list(
            PredictionHistory.objects.values("predicted_crowd")
            .annotate(count=Count("id"))
            .order_by("-count")
        )
    )


@api_view(["GET"])
@permission_classes([IsAdminUser])
def top_crowded_stations(request):
    return Response(
        list(
            PredictionHistory.objects.values("station")
            .annotate(
                high_count=Count("id", filter=Q(predicted_crowd="HIGH")),
                total=Count("id"),
            )
            .order_by("-high_count", "-total")[:10]
        )
    )


@api_view(["GET"])
@permission_classes([IsAdminUser])
def prediction_trends(request):
    return Response(
        list(
            PredictionHistory.objects.annotate(date=TruncDate("created_at"))
            .values("date")
            .annotate(total=Count("id"))
            .order_by("date")
        )
    )


@api_view(["GET"])
@permission_classes([IsAdminUser])
def visitor_growth(request):
    return Response(
        list(
            Visitor.objects.annotate(date=TruncDate("visited_at"))
            .values("date")
            .annotate(total=Count("id"), unique=Count("session_key", distinct=True))
            .order_by("date")
        )
    )


@api_view(["GET"])
@permission_classes([IsAdminUser])
def weather_impact_analysis(request):
    return Response(
        list(
            PredictionHistory.objects.values("weather")
            .annotate(
                total=Count("id"),
                high=Count("id", filter=Q(predicted_crowd="HIGH")),
                medium=Count("id", filter=Q(predicted_crowd="MEDIUM")),
                low=Count("id", filter=Q(predicted_crowd="LOW")),
            )
            .order_by("-total")
        )
    )


@api_view(["GET"])
@permission_classes([IsAdminUser])
def peak_prediction_hours(request):
    return Response(
        list(
            PredictionHistory.objects.annotate(hour=ExtractHour("created_at"))
            .values("hour")
            .annotate(total=Count("id"))
            .order_by("-total")[:12]
        )
    )


@api_view(["GET"])
@permission_classes([IsAdminUser])
def recent_activities(request):
    qs = PredictionHistory.objects.select_related("user").all()[:20]
    return Response(PredictionHistorySerializer(qs, many=True).data)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def prediction_history(request):
    try:
        limit = int(request.GET.get("limit", 100))
    except ValueError:
        limit = 100

    qs = PredictionHistory.objects.select_related("user").all()[:limit]
    return Response(PredictionHistorySerializer(qs, many=True).data)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def visitor_history(request):
    qs = Visitor.objects.select_related("user").all()[:200]
    return Response(VisitorSerializer(qs, many=True).data)
