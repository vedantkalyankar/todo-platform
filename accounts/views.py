import logging

from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import extend_schema

from .serializers import (
    RegisterSerializer,
    UserSerializer,
    ProfileSerializer,
    LogoutSerializer,
    AvatarSerializer,
)

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
    request=ProfileSerializer,
    responses=UserSerializer,
)
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = ProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response(
            UserSerializer(user).data,
        )


@extend_schema(
    request=AvatarSerializer,
    responses=UserSerializer,
)
class AvatarView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AvatarSerializer(
            request.user,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)

        avatar_type = serializer.validated_data.get(
            "avatar_type",
            "custom",
        )

        if avatar_type == "default":
            user = request.user

            if user.avatar:
                user.avatar.delete(save=False)

            user.avatar = None
            user.avatar_type = "default"
            user.avatar_key = serializer.validated_data["avatar_key"]
            user.save()

        else:
            user = serializer.save(
                avatar_type="custom",
                avatar_key="",
            )

        return Response(
            UserSerializer(user).data,
        )

    def delete(self, request):
        user = request.user

        if user.avatar:
            user.avatar.delete(save=False)

        user.avatar = None
        user.avatar_type = "default"
        user.avatar_key = "default-1"
        user.save()

        return Response(
            UserSerializer(user).data,
        )


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
