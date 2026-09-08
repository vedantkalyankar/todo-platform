from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    AvatarView,
    LogoutView,
    MeView,
    ProfileView,
    RegisterView,
)

urlpatterns = [
    path(
        "register/",
        RegisterView.as_view(),
        name="register",
    ),
    path(
        "login/",
        TokenObtainPairView.as_view(),
        name="login",
    ),
    path(
        "token/refresh/",
        TokenRefreshView.as_view(),
        name="token-refresh",
    ),
    path(
        "me/",
        MeView.as_view(),
        name="me",
    ),
    path(
        "profile/",
        ProfileView.as_view(),
        name="profile",
    ),
    path(
        "profile/avatar/",
        AvatarView.as_view(),
        name="profile-avatar",
    ),
    path(
        "logout/",
        LogoutView.as_view(),
        name="logout",
    ),
]
