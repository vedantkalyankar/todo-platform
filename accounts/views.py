import logging

from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import extend_schema

from .serializers import RegisterSerializer, UserSerializer, LogoutSerializer


logger = logging.getLogger(__name__)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()

        logger.info(
            "User registered: user_id=%s",
            user.id,
        )


@extend_schema(
    responses=UserSerializer,
)
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


@extend_schema(
    request=LogoutSerializer,
    responses={204: None},
)
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {"detail": "Refresh token is required."},
                status=400,
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()

        except Exception:
            logger.warning(
                "Logout failed: user_id=%s invalid refresh token",
                request.user.id,
            )

            return Response(
                {"detail": "Invalid or expired refresh token."},
                status=400,
            )

        logger.info(
            "User logged out: user_id=%s",
            request.user.id,
        )

        return Response(
            {"detail": "Successfully logged out."},
            status=200,
        )