from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.serializers import MeSerializer, RegisterSerializer


class RegisterView(APIView):
    """Inscription d'un client ou d'un livreur. Renvoie directement un token."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {"token": token.key, "username": user.username, "role": user.profile.role},
            status=status.HTTP_201_CREATED,
        )


class MeView(APIView):
    """Infos sur l'utilisateur connecté (utile pour le front : rôle, etc.)."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        role = getattr(getattr(user, "profile", None), "role", "client")
        data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": "admin" if user.is_staff else role,
            "is_staff": user.is_staff,
        }
        return Response(MeSerializer(data).data)
