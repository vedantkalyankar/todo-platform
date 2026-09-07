from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from todos.models import Todo


User = get_user_model()


class Command(BaseCommand):
    help = "Create 100 test users with 100 todos each."

    USERS_COUNT = 100
    TODOS_PER_USER = 100

    def handle(self, *args, **options):
        created_users = 0
        created_todos = 0

        statuses = [
            Todo.Status.PENDING,
            Todo.Status.IN_PROGRESS,
            Todo.Status.COMPLETED,
        ]

        priorities = [1, 2, 3, 4]

        with transaction.atomic():
            for user_number in range(
                1,
                self.USERS_COUNT + 1,
            ):
                username = f"loadtest_user_{user_number}"

                user, created = User.objects.get_or_create(
                    username=username,
                    defaults={
                        "email": (
                            f"loadtest_user_{user_number}"
                            "@example.com"
                        ),
                        "first_name": f"LoadTest{user_number}",
                        "last_name": "User",
                    },
                )

                if created:
                    user.set_password("LoadTest@12345")
                    user.save()
                    created_users += 1

                existing_titles = set(
                    Todo.objects.filter(
                        user=user,
                        title__startswith=(
                            f"Load Test Todo {user_number}-"
                        ),
                    ).values_list(
                        "title",
                        flat=True,
                    )
                )

                todos_to_create = []

                for todo_number in range(
                    1,
                    self.TODOS_PER_USER + 1,
                ):
                    title = (
                        f"Load Test Todo "
                        f"{user_number}-{todo_number}"
                    )

                    if title in existing_titles:
                        continue

                    todos_to_create.append(
                        Todo(
                            user=user,
                            title=title,
                            description=(
                                f"This is load test todo "
                                f"{todo_number} for "
                                f"load test user {user_number}. "
                                f"It contains realistic test "
                                f"data for API filtering, "
                                f"search, pagination, and "
                                f"performance testing."
                            ),
                            status=statuses[
                                (todo_number - 1)
                                % len(statuses)
                            ],
                            priority=priorities[
                                (todo_number - 1)
                                % len(priorities)
                            ],
                            due_date=(
                                timezone.now()
                                + timedelta(
                                    days=todo_number
                                )
                            ),
                            is_deleted=False,
                        )
                    )

                if todos_to_create:
                    Todo.objects.bulk_create(
                        todos_to_create,
                        batch_size=1000,
                    )

                    created_todos += len(
                        todos_to_create
                    )

        self.stdout.write(
            self.style.SUCCESS(
                f"Users created: {created_users}"
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Todos created: {created_todos}"
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                "Load test data generation completed."
            )
        )