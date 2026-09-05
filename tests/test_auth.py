import pytest
from rest_framework import status


pytestmark = pytest.mark.django_db


REGISTER_URL = "/api/v1/auth/register/"
LOGIN_URL = "/api/v1/auth/login/"
ME_URL = "/api/v1/auth/me/"

def test_user_registration(api_client):
    payload = {
        "username": "newuser",
        "email": "newuser@example.com",
        "password": "StrongPassword123!",
        "password_confirm": "StrongPassword123!",
    }

    response = api_client.post(
        REGISTER_URL,
        payload,
        format="json",
    )

    assert response.status_code == status.HTTP_201_CREATED
    assert response.data["username"] == "newuser"
    assert response.data["email"] == "newuser@example.com"
    assert "password" not in response.data


def test_registration_rejects_password_mismatch(api_client):
    payload = {
        "username": "newuser",
        "email": "newuser@example.com",
        "password": "StrongPassword123!",
        "password_confirm": "DifferentPassword123!",
    }

    response = api_client.post(
        REGISTER_URL,
        payload,
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_registration_rejects_duplicate_email(api_client, user):
    payload = {
        "username": "anotheruser",
        "email": user.email,
        "password": "StrongPassword123!",
        "password_confirm": "StrongPassword123!",
    }

    response = api_client.post(
        REGISTER_URL,
        payload,
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_login_returns_tokens(api_client, user):
    response = api_client.post(
        LOGIN_URL,
        {
            "username": user.username,
            "password": "TestPassword123!",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    assert "access" in response.data
    assert "refresh" in response.data


def test_login_rejects_invalid_password(api_client, user):
    response = api_client.post(
        LOGIN_URL,
        {
            "username": user.username,
            "password": "WrongPassword123!",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_me_requires_authentication(api_client):
    response = api_client.get(ME_URL)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_me_returns_authenticated_user(authenticated_client, user):
    response = authenticated_client.get(ME_URL)

    assert response.status_code == status.HTTP_200_OK
    assert response.data["id"] == user.id
    assert response.data["username"] == user.username
    assert response.data["email"] == user.email