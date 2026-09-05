import pytest
from rest_framework import status
from rest_framework.test import APIClient

from tests.factories import UserFactory


pytestmark = pytest.mark.django_db


LOGIN_URL = "/api/v1/auth/login/"
REFRESH_URL = "/api/v1/auth/token/refresh/"
LOGOUT_URL = "/api/v1/auth/logout/"
ME_URL = "/api/v1/auth/me/"


def get_auth_tokens():
    user = UserFactory()

    client = APIClient()

    response = client.post(
        LOGIN_URL,
        {
            "username": user.username,
            "password": "TestPassword123!",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK

    return user, response.data


def test_login_returns_access_and_refresh_tokens():
    user, tokens = get_auth_tokens()

    assert user is not None
    assert "access" in tokens
    assert "refresh" in tokens


def test_refresh_token_returns_new_tokens():
    user, tokens = get_auth_tokens()

    client = APIClient()

    response = client.post(
        REFRESH_URL,
        {
            "refresh": tokens["refresh"],
        },
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    assert "access" in response.data
    assert "refresh" in response.data

    assert response.data["access"] != tokens["access"]
    assert response.data["refresh"] != tokens["refresh"]


def test_rotated_refresh_token_cannot_be_reused():
    user, tokens = get_auth_tokens()

    client = APIClient()

    response = client.post(
        REFRESH_URL,
        {
            "refresh": tokens["refresh"],
        },
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK

    new_refresh = response.data["refresh"]

    old_refresh_response = client.post(
        REFRESH_URL,
        {
            "refresh": tokens["refresh"],
        },
        format="json",
    )

    assert old_refresh_response.status_code == status.HTTP_401_UNAUTHORIZED

    # The newly issued refresh token must still work.
    new_refresh_response = client.post(
        REFRESH_URL,
        {
            "refresh": new_refresh,
        },
        format="json",
    )

    assert new_refresh_response.status_code == status.HTTP_200_OK


def test_logout_blacklists_refresh_token():
    user, tokens = get_auth_tokens()

    client = APIClient()

    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {tokens['access']}",
    )

    response = client.post(
        LOGOUT_URL,
        {
            "refresh": tokens["refresh"],
        },
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.data["detail"] == "Successfully logged out."


def test_blacklisted_refresh_token_cannot_be_used_after_logout():
    user, tokens = get_auth_tokens()

    client = APIClient()

    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {tokens['access']}",
    )

    logout_response = client.post(
        LOGOUT_URL,
        {
            "refresh": tokens["refresh"],
        },
        format="json",
    )

    assert logout_response.status_code == status.HTTP_200_OK

    refresh_response = client.post(
        REFRESH_URL,
        {
            "refresh": tokens["refresh"],
        },
        format="json",
    )

    assert refresh_response.status_code == status.HTTP_401_UNAUTHORIZED