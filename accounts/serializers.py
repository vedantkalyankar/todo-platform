from django.contrib.auth import get_user_model
from rest_framework import serializers
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    password_confirm = serializers.CharField(
        write_only=True,
    )

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "password",
            "password_confirm",
        )

    def validate_email(self, value):
        return value.lower().strip()

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError(
                {"password_confirm": "Passwords do not match."}
            )

        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")

        user = User.objects.create_user(
            **validated_data,
        )

        return user


class UserSerializer(serializers.ModelSerializer):
    username_change_available_at = serializers.SerializerMethodField()
    email_change_available_at = serializers.SerializerMethodField()
    password_change_available_at = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "created_at",
            "username_change_available_at",
            "email_change_available_at",
            "password_change_available_at",
            "avatar",
            "avatar_type",
            "avatar_key",
        )
        read_only_fields = (
            "id",
            "created_at",
            "username_change_available_at",
            "email_change_available_at",
            "password_change_available_at",
            "avatar",
            "avatar_type",
            "avatar_key",
        )

    def get_username_change_available_at(self, obj):
        if not obj.username_changed_at:
            return None

        return obj.username_changed_at + timedelta(days=30)

    def get_email_change_available_at(self, obj):
        if not obj.email_changed_at:
            return None

        return obj.email_changed_at + timedelta(days=30)

    def get_password_change_available_at(self, obj):
        if not obj.password_changed_at:
            return None

        return obj.password_changed_at + timedelta(days=30)


class ProfileSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=False,
        min_length=8,
    )

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "password",
        )

    def validate_username(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError("Username cannot be empty.")

        return value

    def validate_email(self, value):
        return value.lower().strip()

    def validate(self, attrs):
        user = self.instance
        now = timezone.now()

        if "username" in attrs and attrs["username"] != user.username:
            if user.username_changed_at and now < user.username_changed_at + timedelta(
                days=30
            ):
                raise serializers.ValidationError(
                    {"username": ("Username cannot be changed again for 30 days.")}
                )

        if "email" in attrs and attrs["email"] != user.email:
            if user.email_changed_at and now < user.email_changed_at + timedelta(
                days=30
            ):
                raise serializers.ValidationError(
                    {"email": ("Email cannot be changed again for 30 days.")}
                )

        if "password" in attrs:
            if user.password_changed_at and now < user.password_changed_at + timedelta(
                days=30
            ):
                raise serializers.ValidationError(
                    {"password": ("Password cannot be changed again for 30 days.")}
                )

        return attrs

    def update(self, instance, validated_data):
        now = timezone.now()

        username_changed = (
            "username" in validated_data
            and validated_data["username"] != instance.username
        )

        email_changed = (
            "email" in validated_data and validated_data["email"] != instance.email
        )

        password_changed = "password" in validated_data

        if username_changed:
            instance.username = validated_data["username"]
            instance.username_changed_at = now

        if email_changed:
            instance.email = validated_data["email"]
            instance.email_changed_at = now

        if password_changed:
            instance.set_password(validated_data["password"])
            instance.password_changed_at = now

        instance.save()

        return instance


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class AvatarSerializer(serializers.ModelSerializer):
    ALLOWED_DEFAULT_AVATARS = {
        "bamboo-stick-svgrepo-com",
        "branches-with-leaves-svgrepo-com",
        "butter-knife-svgrepo-com",
        "chinese-paper-writing-svgrepo-com",
        "dish-and-toothpick-svgrepo-com",
        "fertilizer-svgrepo-com",
        "gong-svgrepo-com",
        "japan-food-svgrepo-com",
        "japanese-bird-svgrepo-com",
        "japanese-character-svgrepo-com",
        "japanese-circular-symbol-svgrepo-com",
        "japanese-flower-svgrepo-com",
        "japanese-hand-fan-svgrepo-com",
        "japanese-ornament-svgrepo-com",
        "japanese-pagoda-svgrepo-com",
        "japanese-tea-pot-svgrepo-com",
        "japanese-yen-paper-bill-svgrepo-com",
        "kamon-japanese-svgrepo-com",
        "kanagawa-japan-kanji-svgrepo-com",
        "miyagi-prefecture-svgrepo-com",
        "n-logo-svgrepo-com",
        "origami-swan-svgrepo-com",
        "ornament-japan-flowers-svgrepo-com",
        "radish-svgrepo-com",
        "speed-limit-100-svgrepo-com",
        "tottori-japanese-flag-symbol-svgrepo-com",
    }

    avatar_type = serializers.ChoiceField(
        choices=("default", "custom"),
        required=False,
    )

    avatar_key = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    class Meta:
        model = User
        fields = (
            "avatar",
            "avatar_type",
            "avatar_key",
        )

    def validate_avatar(self, value):
        max_size = 5 * 1024 * 1024

        if value.size > max_size:
            raise serializers.ValidationError(
                "Avatar image must be 5 MB or smaller."
            )

        allowed_types = {
            "image/jpeg",
            "image/png",
            "image/webp",
        }

        if value.content_type not in allowed_types:
            raise serializers.ValidationError(
                "Only JPG, JPEG, PNG, and WebP images are allowed."
            )

        return value

    def validate(self, attrs):
        avatar_type = attrs.get("avatar_type")
        avatar_key = attrs.get("avatar_key")
        avatar = attrs.get("avatar")

        if avatar_type == "default":
            if avatar_key not in self.ALLOWED_DEFAULT_AVATARS:
                raise serializers.ValidationError(
                    {
                        "avatar_key": "Invalid default avatar."
                    }
                )

            if avatar:
                raise serializers.ValidationError(
                    {
                        "avatar": (
                            "Custom image cannot be provided "
                            "for a default avatar."
                        )
                    }
                )

        if avatar_type == "custom":
            if not avatar:
                raise serializers.ValidationError(
                    {
                        "avatar": (
                            "Avatar image is required "
                            "for a custom avatar."
                        )
                    }
                )

            if avatar_key not in (None, ""):
                raise serializers.ValidationError(
                    {
                        "avatar_key": (
                            "Custom avatars cannot have "
                            "an avatar key."
                        )
                    }
                )

        return attrs