from django.db import models

class Train(models.Model):
    train_name = models.CharField(max_length=100)
    source_station = models.CharField(max_length=100)
    destination_station = models.CharField(max_length=100)
    departure_time = models.TimeField()
    arrival_time = models.TimeField()
    line = models.CharField(max_length=50)

    def __str__(self):
        return self.train_name
    
class Station(models.Model):
    station_name = models.CharField(max_length=100)
    line = models.CharField(max_length=50)

    def __str__(self):
        return self.station_name