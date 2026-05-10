
from django.http import JsonResponse
from django.contrib.auth import get_user_model, authenticate, login
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.utils import timezone
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.db import transaction
import hashlib
import secrets
import datetime
import uuid

User = get_user_model()

# Temporary token storage
verification_tokens = {}

from .models import EmailOTP

OTP_EXPIRY_MINUTES = 5


def _hash_otp(otp: str, salt: str) -> str:
    return hashlib.sha256(f"{salt}:{otp}".encode("utf-8")).hexdigest()


def _generate_otp() -> str:
    return f"{secrets.randbelow(1_000_000):06d}"


def _send_otp_email(to_email: str, otp: str, purpose: str):

    subject = "Your OTP for Rush Radar"

    if purpose == EmailOTP.PURPOSE_REGISTER:
        heading = "Account verification"
    else:
        heading = "Login verification"

    message = (
        f"{heading} OTP: {otp}\n\n"
        f"This OTP expires in {OTP_EXPIRY_MINUTES} minutes.\n"
        "If you did not request this, ignore this email."
    )

    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [to_email],
        fail_silently=False,
    )


def _create_otp(user: User, purpose: str):

    otp = _generate_otp()

    salt = secrets.token_hex(16)

    otp_hash = _hash_otp(otp, salt)

    expires_at = timezone.now() + datetime.timedelta(
        minutes=OTP_EXPIRY_MINUTES
    )

    record = EmailOTP.objects.create(
        user=user,
        purpose=purpose,
        otp_hash=otp_hash,
        salt=salt,
        expires_at=expires_at,
    )

    return record, otp


# ✅ REGISTER API
@csrf_exempt
def register(request):

    if request.method == "POST":

        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")

        # 🔒 Validation
        if not username or not email or not password:

            return JsonResponse({
                "error": "All fields required"
            }, status=400)

        if User.objects.filter(username=username).exists():

            return JsonResponse({
                "error": "Username already exists"
            }, status=400)

        if User.objects.filter(email=email).exists():

            return JsonResponse({
                "error": "Email already exists"
            }, status=400)

        try:

            try:
                validate_email(email)

            except ValidationError:

                return JsonResponse({
                    "error": "Invalid email"
                }, status=400)

            with transaction.atomic():

                # 👤 Create user
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    is_active=False
                )

                otp_record, otp = _create_otp(
                    user=user,
                    purpose=EmailOTP.PURPOSE_REGISTER
                )

                _send_otp_email(
                    to_email=email,
                    otp=otp,
                    purpose=EmailOTP.PURPOSE_REGISTER
                )

            return JsonResponse({
                "message": "OTP sent to your email. Please verify to activate account.",
                "otp_required": True,
                "otp_id": str(otp_record.id),
                "email": email,
            }, status=201)

        except Exception as e:

            return JsonResponse({
                "error": str(e)
            }, status=500)

    return JsonResponse({
        "error": "Invalid request method"
    }, status=405)


# ✅ VERIFY EMAIL
def verify_email(request, token):

    try:

        if token not in verification_tokens:

            return JsonResponse({
                "error": "Invalid or expired token"
            }, status=400)

        user_id = verification_tokens[token]

        user = User.objects.get(id=user_id)

        # ✅ Activate account
        user.is_active = True
        user.save()

        # 🗑 Remove token
        del verification_tokens[token]

        return JsonResponse({
            "message": "Account verified successfully ✅"
        })

    except Exception as e:

        return JsonResponse({
            "error": str(e)
        }, status=500)


# ✅ USER LOGIN
@csrf_exempt
@ensure_csrf_cookie
def user_login(request):

    if request.method == "POST":

        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")

        if (not username and not email) or not password:

            return JsonResponse({
                "error": "Email/Username & password required"
            }, status=400)

        # Allow email in username field
        if username and (not email) and ("@" in username):

            email = username
            username = None

        # Convert email → username
        if email and not username:

            try:
                validate_email(email)

            except ValidationError:

                return JsonResponse({
                    "error": "Invalid email"
                }, status=400)

            try:
                u = User.objects.get(email=email)
                username = u.username

            except User.DoesNotExist:

                return JsonResponse({
                    "error": "Invalid username or password"
                }, status=400)

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user:

            # 🔒 Email verification check
            if not user.is_active:

                return JsonResponse({
                    "error": "Please verify your email first"
                }, status=403)

            # ✅ Login user
            login(request, user)

            return JsonResponse({
                "message": "Login successful ✅",
                "username": user.username,
                "email": user.email,
                "is_admin": user.is_staff or user.is_superuser
            })

        return JsonResponse({
            "error": "Invalid username or password"
        }, status=400)

    return JsonResponse({
        "error": "Invalid request method"
    }, status=405)


# ✅ ADMIN LOGIN
@csrf_exempt
@ensure_csrf_cookie
def admin_login(request):

    if request.method != "POST":

        return JsonResponse({
            "error": "Invalid request method"
        }, status=405)

    username = request.POST.get("username")
    email = request.POST.get("email")
    password = request.POST.get("password")

    if (not username and not email) or not password:

        return JsonResponse({
            "error": "Email/Username & password required"
        }, status=400)

    # Allow email in username field
    if username and (not email) and ("@" in username):

        email = username
        username = None

    if email and not username:

        try:
            validate_email(email)

        except ValidationError:

            return JsonResponse({
                "error": "Invalid email"
            }, status=400)

        try:
            u = User.objects.get(email=email)
            username = u.username

        except User.DoesNotExist:

            return JsonResponse({
                "error": "Invalid username or password"
            }, status=400)

    user = authenticate(
        request,
        username=username,
        password=password
    )

    if not user:

        return JsonResponse({
            "error": "Invalid username or password"
        }, status=400)

    if not user.is_active:

        return JsonResponse({
            "error": "Please verify your email first"
        }, status=403)

    if not (user.is_staff or user.is_superuser):

        return JsonResponse({
            "error": "Not an admin user"
        }, status=403)

    login(request, user)

    return JsonResponse({
        "message": "Admin login successful ✅",
        "redirect": "/admin/",
        "username": user.username,
        "email": user.email
    })


# ✅ DASHBOARD
@login_required
def dashboard(request):

    return JsonResponse({
        "message": f"Welcome {request.user.username}"
    })


# ✅ OTP RESEND
@csrf_exempt
def otp_resend(request):

    if request.method != "POST":

        return JsonResponse({
            "error": "Invalid request method"
        }, status=405)

    otp_id = request.POST.get("otp_id")

    if not otp_id:

        return JsonResponse({
            "error": "otp_id required"
        }, status=400)

    try:
        otp_obj = EmailOTP.objects.select_related("user").get(id=otp_id)

    except EmailOTP.DoesNotExist:

        return JsonResponse({
            "error": "Invalid otp_id"
        }, status=400)

    if otp_obj.is_consumed:

        return JsonResponse({
            "error": "OTP already used"
        }, status=400)

    user = otp_obj.user
    purpose = otp_obj.purpose

    otp_obj.consumed_at = timezone.now()
    otp_obj.save(update_fields=["consumed_at"])

    new_record, otp = _create_otp(
        user=user,
        purpose=purpose
    )

    _send_otp_email(
        to_email=user.email,
        otp=otp,
        purpose=purpose
    )

    return JsonResponse({
        "message": "OTP resent to your email.",
        "otp_id": str(new_record.id),
        "email": user.email,
    })


# ✅ VERIFY REGISTER OTP
@csrf_exempt
def otp_verify_register(request):

    if request.method != "POST":

        return JsonResponse({
            "error": "Invalid request method"
        }, status=405)

    otp_id = request.POST.get("otp_id")
    otp = request.POST.get("otp")

    if not otp_id or not otp:

        return JsonResponse({
            "error": "otp_id and otp required"
        }, status=400)

    try:
        otp_obj = EmailOTP.objects.select_related("user").get(
            id=otp_id,
            purpose=EmailOTP.PURPOSE_REGISTER
        )

    except EmailOTP.DoesNotExist:

        return JsonResponse({
            "error": "Invalid OTP"
        }, status=400)

    if otp_obj.is_consumed:

        return JsonResponse({
            "error": "OTP already used"
        }, status=400)

    if otp_obj.is_expired:

        return JsonResponse({
            "error": "OTP expired"
        }, status=400)

    otp_obj.attempts += 1

    if otp_obj.attempts > 5:

        otp_obj.consumed_at = timezone.now()

        otp_obj.save(update_fields=[
            "attempts",
            "consumed_at"
        ])

        return JsonResponse({
            "error": "Too many attempts. Please resend OTP."
        }, status=429)

    expected = otp_obj.otp_hash

    actual = _hash_otp(
        otp.strip(),
        otp_obj.salt
    )

    if actual != expected:

        otp_obj.save(update_fields=["attempts"])

        return JsonResponse({
            "error": "Invalid OTP"
        }, status=400)

    # ✅ Success
    otp_obj.consumed_at = timezone.now()

    otp_obj.save(update_fields=[
        "attempts",
        "consumed_at"
    ])

    user = otp_obj.user

    user.is_active = True
    user.is_verified = True

    user.save(update_fields=[
        "is_active",
        "is_verified"
    ])

    return JsonResponse({
        "message": "Account verified successfully ✅"
    })


# ✅ OTP LOGIN DISABLED
@csrf_exempt
def otp_verify_login(request):

    return JsonResponse({
        "error": "OTP login is disabled"
    }, status=404)
