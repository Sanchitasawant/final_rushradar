from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from django.db.models import Count
from django.contrib.auth import get_user_model
from django.db.models.functions import ExtractHour, TruncDate
from .models import PredictionHistory, Visitor
import json

User = get_user_model()

@staff_member_required
def analytics_dashboard(request):
    total_users = User.objects.count()
    total_predictions = PredictionHistory.objects.count()
    total_visitors = Visitor.objects.count()

    # Peak Crowd Time
    peak_row = (
        PredictionHistory.objects.annotate(hour=ExtractHour("created_at"))
        .values("hour")
        .annotate(total=Count("id"))
        .order_by("-total")
        .first()
    )
    peak_crowd_time = f"{peak_row['hour']:02d}:00" if peak_row and peak_row["hour"] is not None else "N/A"

    # Most Crowded Station
    most_crowded = (
        PredictionHistory.objects.values("station")
        .annotate(total=Count("id"))
        .order_by("-total")
        .first()
    )
    most_crowded_station = most_crowded["station"] if most_crowded else "N/A"

    # Crowd Distribution Pie Chart
    crowd_dist = list(PredictionHistory.objects.values("predicted_crowd").annotate(count=Count("id")))
    
    # Top Crowded Stations Bar Chart
    top_stations = list(PredictionHistory.objects.values("station").annotate(count=Count("id")).order_by("-count")[:10])

    # Daily Prediction Trends
    trends = list(PredictionHistory.objects.annotate(date=TruncDate("created_at")).values("date").annotate(count=Count("id")).order_by("date"))
    
    # Convert dates to string for JSON serialization
    for t in trends:
        if t["date"]:
            t["date"] = t["date"].strftime("%Y-%m-%d")

    context = {
        "title": "Analytics Dashboard",
        "total_users": total_users,
        "total_predictions": total_predictions,
        "total_visitors": total_visitors,
        "peak_crowd_time": peak_crowd_time,
        "most_crowded_station": most_crowded_station,
        "crowd_dist_json": crowd_dist,
        "top_stations_json": top_stations,
        "trends_json": trends,
    }

    return render(request, "admin/analytics_dashboard.html", context)
