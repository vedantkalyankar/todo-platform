from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(
        unique=True,
    )

    username_changed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    email_changed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    password_changed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    avatar = models.ImageField(
        upload_to="avatars/",
        null=True,
        blank=True,
    )

    avatar_type = models.CharField(
        max_length=20,
        default="default",
    )

    avatar_key = models.CharField(
        max_length=50,
        default="default-1",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return self.username