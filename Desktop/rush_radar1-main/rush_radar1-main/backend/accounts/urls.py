from django.urls import path
from .views import (
    register,
    user_login,
    verify_email,
    dashboard,
    otp_resend,
    otp_verify_register,
    otp_verify_login,
)

urlpatterns = [
    path('register/', register),
    path('login/', user_login),
    path('verify/<str:token>/', verify_email),
    path('dashboard/', dashboard),   # ✅ ADD THIS
    path('otp/resend/', otp_resend),
    path('otp/verify-register/', otp_verify_register),
]