from django.urls import path
from .views import get_timetable

urlpatterns = [
    path('', get_timetable),
]