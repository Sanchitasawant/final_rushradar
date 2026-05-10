from django.contrib import admin
from django.urls import path
from django.shortcuts import redirect

from accounts.views import (
    register,
    user_login,
    admin_login,
    verify_email,
    dashboard,
    otp_resend,
    otp_verify_register,
)

from prediction.views import (
    analytics_overview,
    crowd_distribution_analytics,
    predict_crowd,
    prediction_history,
    prediction_trends,
    recent_activities,
    stations_list,
    timetable,
    top_crowded_stations,
    visitor_growth,
    visitor_history,
    weather_impact_analysis,
    crowd_stats,
    peak_hours,
    peak_prediction_hours,
)

from prediction.admin_views import analytics_dashboard

def custom_admin_logout(request):
    from django.contrib.auth import logout
    logout(request)
    return redirect("http://localhost:3000/")

urlpatterns = [

    path('admin/logout/', custom_admin_logout, name='admin_logout'),
    path('admin/analytics-dashboard/', analytics_dashboard, name='analytics_dashboard'),
    path('admin/', admin.site.urls),

    # AUTH APIs
    path('register/', register),
    path('login/', user_login),
    path('admin-login/', admin_login),
    path('verify/<str:token>/', verify_email),
    path('dashboard/', dashboard),
    path('otp/resend/', otp_resend),
    path('otp/verify-register/', otp_verify_register),

    # Prediction APIs
    path('api/predict/', predict_crowd),
    path('api/stations/', stations_list),
    path('api/timetable/', timetable),

    # Dashboard APIs
    path('api/crowd-stats/', crowd_stats),
    path('api/peak-hours/', peak_hours),
    path('api/analytics/overview/', analytics_overview),
    path('api/analytics/crowd-distribution/', crowd_distribution_analytics),
    path('api/analytics/top-stations/', top_crowded_stations),
    path('api/analytics/trends/', prediction_trends),
    path('api/analytics/visitor-growth/', visitor_growth),
    path('api/analytics/weather-impact/', weather_impact_analysis),
    path('api/analytics/peak-hours/', peak_prediction_hours),
    path('api/analytics/recent-activities/', recent_activities),
    path('api/analytics/prediction-history/', prediction_history),
    path('api/analytics/visitor-history/', visitor_history),
]