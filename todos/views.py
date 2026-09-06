import logging

from django.db.models import Count, Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Todo
from .serializers import TodoSerializer


logger = logging.getLogger(__name__)


class TodoViewSet(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_fields = [
        "status",
        "priority",
    ]

    search_fields = [
        "title",
        "description",
    ]

    ordering_fields = [
        "created_at",
        "updated_at",
        "priority",
        "due_date",
        "title",
    ]

    ordering = [
        "-created_at",
    ]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Todo.objects.none()

        return Todo.objects.filter(
            user=self.request.user,
            is_deleted=False,
        )

    @action(
        detail=False,
        methods=["get"],
        url_path="stats",
    )
    def stats(self, request):
        queryset = self.get_queryset()

        counts = queryset.aggregate(
            total=Count("id"),
            pending=Count(
                "id",
                filter=Q(status=Todo.Status.PENDING),
            ),
            in_progress=Count(
                "id",
                filter=Q(status=Todo.Status.IN_PROGRESS),
            ),
            completed=Count(
                "id",
                filter=Q(status=Todo.Status.COMPLETED),
            ),
        )

        return Response(
            counts,
            status=status.HTTP_200_OK,
        )

    def perform_create(self, serializer):
        todo = serializer.save(
            user=self.request.user,
        )

        logger.info(
            "Todo created: todo_id=%s user_id=%s",
            todo.id,
            self.request.user.id,
        )

    def perform_update(self, serializer):
        todo = serializer.save()

        logger.info(
            "Todo updated: todo_id=%s user_id=%s",
            todo.id,
            self.request.user.id,
        )

    def perform_destroy(self, instance):
        instance.is_deleted = True

        instance.save(
            update_fields=[
                "is_deleted",
                "updated_at",
            ]
        )

        logger.info(
            "Todo soft-deleted: todo_id=%s user_id=%s",
            instance.id,
            self.request.user.id,
        )
