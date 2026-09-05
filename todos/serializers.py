from rest_framework import serializers

from .models import Todo


class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo

        fields = (
            "id",
            "title",
            "description",
            "status",
            "priority",
            "due_date",
            "is_deleted",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "is_deleted",
            "created_at",
            "updated_at",
        )

    def validate_title(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Title cannot be empty."
            )

        return value

    def validate_description(self, value):
        return value.strip()