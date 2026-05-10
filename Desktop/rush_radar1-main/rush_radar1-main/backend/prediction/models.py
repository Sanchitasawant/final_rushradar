from django.db import models
from django.conf import settings
from trains.models import Train, Station

class CrowdData(models.Model):
    train = models.ForeignKey(Train, on_delete=models.CASCADE)
    station = models.ForeignKey(Station, on_delete=models.CASCADE)
    time = models.TimeField()
    day = models.CharField(max_length=20)
    weather = models.CharField(max_length=20)
    crowd_level = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.train} - {self.station} - {self.crowd_level}"


class PredictionHistory(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="prediction_history",
    )
    station = models.CharField(max_length=100)
    train = models.CharField(max_length=100)
    weather = models.CharField(max_length=50)
    day = models.CharField(max_length=20)
    predicted_crowd = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["station", "predicted_crowd"]),
            models.Index(fields=["weather"]),
            models.Index(fields=["day"]),
        ]

    def __str__(self):
        return f"{self.station} | {self.train} | {self.predicted_crowd}"


class Visitor(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="visits",
    )
    session_key = models.CharField(max_length=100, db_index=True)
    path = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    visited_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-visited_at"]
        indexes = [
            models.Index(fields=["path", "visited_at"]),
        ]

    def __str__(self):
        return f"{self.session_key} -> {self.path}"
