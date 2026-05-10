from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from django.contrib.auth.hashers import make_password, check_password


@api_view(['POST'])
def register_user(request):

    name = request.data.get("name")
    email = request.data.get("email")
    password = request.data.get("password")

    if not name or not email or not password:
        return Response({"error": "All fields required"}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already exists"}, status=400)

    user = User.objects.create(
        name=name,
        email=email,
        password=make_password(password)
    )

    return Response({"message": "User registered successfully"})
@api_view(['POST'])
def login_user(request):

    email = request.data.get("email")
    password = request.data.get("password")

    try:
        user = User.objects.get(email=email)

        if not check_password(password, user.password):
            return Response({"error": "Invalid credentials"}, status=400)

        return Response({
            "message": "Login successful",
            "user": user.name
        })

    except User.DoesNotExist:
        return Response({"error": "Invalid credentials"})