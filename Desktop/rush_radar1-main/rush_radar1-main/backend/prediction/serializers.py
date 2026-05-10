from rest_framework import serializers
from .models import CrowdData, PredictionHistory, Visitor

class CrowdDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrowdData
        fields = '__all__'


class PredictionHistorySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = PredictionHistory
        fields = [
            "id",
            "username",
            "station",
            "train",
            "weather",
            "day",
            "predicted_crowd",
            "created_at",
        ]


class VisitorSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Visitor
        fields = [
            "id",
            "username",
            "session_key",
            "path",
            "ip_address",
            "user_agent",
            "visited_at",
        ]