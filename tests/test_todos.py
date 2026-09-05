import pytest
from rest_framework import status

from todos.models import Todo
from datetime import timedelta

from django.utils import timezone

from todos.tasks import cleanup_deleted_todos
pytestmark = pytest.mark.django_db


TODOS_URL = "/api/v1/todos/"


def todo_detail_url(todo):
    return f"{TODOS_URL}{todo.id}/"


def test_create_todo(authenticated_client):
    payload = {
        "title": "Learn pytest",
        "description": "Write production-grade API tests.",
        "status": "pending",
        "priority": 3,
    }

    response = authenticated_client.post(
        TODOS_URL,
        payload,
        format="json",
    )

    assert response.status_code == status.HTTP_201_CREATED
    assert response.data["title"] == "Learn pytest"
    assert response.data["priority"] == 3
    assert response.data["is_deleted"] is False


def test_list_todos(authenticated_client, user):
    Todo.objects.create(
        user=user,
        title="Todo 1",
    )

    Todo.objects.create(
        user=user,
        title="Todo 2",
    )

    response = authenticated_client.get(
        TODOS_URL,
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.data["count"] == 2
    assert len(response.data["results"]) == 2


def test_retrieve_todo(authenticated_client, user):
    todo = Todo.objects.create(
        user=user,
        title="Retrieve me",
    )

    response = authenticated_client.get(
        todo_detail_url(todo),
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.data["id"] == str(todo.id)
    assert response.data["title"] == "Retrieve me"


def test_update_todo(authenticated_client, user):
    todo = Todo.objects.create(
        user=user,
        title="Original title",
        status=Todo.Status.PENDING,
    )

    response = authenticated_client.patch(
        todo_detail_url(todo),
        {
            "status": "completed",
            "title": "Updated title",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.data["status"] == "completed"
    assert response.data["title"] == "Updated title"


def test_soft_delete_todo(authenticated_client, user):
    todo = Todo.objects.create(
        user=user,
        title="Delete me",
    )

    response = authenticated_client.delete(
        todo_detail_url(todo),
    )

    assert response.status_code == status.HTTP_204_NO_CONTENT

    todo.refresh_from_db()

    assert todo.is_deleted is True


def test_deleted_todo_is_not_visible(
    authenticated_client,
    user,
):
    todo = Todo.objects.create(
        user=user,
        title="Deleted Todo",
        is_deleted=True,
    )

    response = authenticated_client.get(
        TODOS_URL,
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.data["count"] == 0

    detail_response = authenticated_client.get(
        todo_detail_url(todo),
    )

    assert detail_response.status_code == status.HTTP_404_NOT_FOUND


def test_filter_by_status(authenticated_client, user):
    Todo.objects.create(
        user=user,
        title="Pending Todo",
        status=Todo.Status.PENDING,
    )

    Todo.objects.create(
        user=user,
        title="Completed Todo",
        status=Todo.Status.COMPLETED,
    )

    response = authenticated_client.get(
        TODOS_URL,
        {"status": "completed"},
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.data["count"] == 1
    assert response.data["results"][0]["title"] == "Completed Todo"


def test_search_todos(authenticated_client, user):
    Todo.objects.create(
        user=user,
        title="Learn Django",
        description="Backend development",
    )

    Todo.objects.create(
        user=user,
        title="Learn PostgreSQL",
    )

    response = authenticated_client.get(
        TODOS_URL,
        {"search": "Django"},
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.data["count"] == 1
    assert response.data["results"][0]["title"] == "Learn Django"


def test_order_todos(authenticated_client, user):
    Todo.objects.create(
        user=user,
        title="Low priority",
        priority=Todo.Priority.LOW,
    )

    Todo.objects.create(
        user=user,
        title="Urgent priority",
        priority=Todo.Priority.URGENT,
    )

    response = authenticated_client.get(
        TODOS_URL,
        {"ordering": "-priority"},
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.data["results"][0]["title"] == "Urgent priority"


def test_pagination(authenticated_client, user):
    Todo.objects.bulk_create(
        [
            Todo(
                user=user,
                title=f"Todo {i}",
            )
            for i in range(25)
        ]
    )

    response = authenticated_client.get(
        TODOS_URL,
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.data["count"] == 25
    assert len(response.data["results"]) == 20

    response_page_2 = authenticated_client.get(
        TODOS_URL,
        {"page": 2},
    )

    assert response_page_2.status_code == status.HTTP_200_OK
    assert len(response_page_2.data["results"]) == 5


def test_user_cannot_access_another_users_todo(
    authenticated_client,
):
    from tests.factories import TodoFactory

    other_user_todo = TodoFactory()

    response = authenticated_client.get(
        todo_detail_url(other_user_todo),
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_user_cannot_update_another_users_todo(
    authenticated_client,
):
    from tests.factories import TodoFactory

    other_user_todo = TodoFactory()

    response = authenticated_client.patch(
        todo_detail_url(other_user_todo),
        {
            "title": "Hacked Todo",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND

    other_user_todo.refresh_from_db()

    assert other_user_todo.title != "Hacked Todo"


def test_user_cannot_delete_another_users_todo(
    authenticated_client,
):
    from tests.factories import TodoFactory

    other_user_todo = TodoFactory()

    response = authenticated_client.delete(
        todo_detail_url(other_user_todo),
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND

    other_user_todo.refresh_from_db()

    assert other_user_todo.is_deleted is False

def test_unauthenticated_user_cannot_list_todos(api_client):
    response = api_client.get(TODOS_URL)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_create_todo_rejects_empty_title(authenticated_client):
    response = authenticated_client.post(
        TODOS_URL,
        {
            "title": "   ",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST

def test_create_todo_strips_title_whitespace(
    authenticated_client,
):
    response = authenticated_client.post(
        TODOS_URL,
        {
            "title": "   Learn Django   ",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_201_CREATED
    assert response.data["title"] == "Learn Django"

def test_create_todo_rejects_invalid_status(
    authenticated_client,
):
    response = authenticated_client.post(
        TODOS_URL,
        {
            "title": "Invalid status",
            "status": "something_invalid",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST

def test_create_todo_rejects_invalid_priority(
    authenticated_client,
):
    response = authenticated_client.post(
        TODOS_URL,
        {
            "title": "Invalid priority",
            "priority": 999,
        },
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST

def test_client_cannot_set_is_deleted(
    authenticated_client,
):
    response = authenticated_client.post(
        TODOS_URL,
        {
            "title": "Protected Todo",
            "is_deleted": True,
        },
        format="json",
    )

    assert response.status_code == status.HTTP_201_CREATED
    assert response.data["is_deleted"] is False

def test_client_cannot_assign_todo_to_another_user(
    authenticated_client,
    user,
):
    from tests.factories import UserFactory

    another_user = UserFactory()

    response = authenticated_client.post(
        TODOS_URL,
        {
            "title": "Ownership test",
            "user": another_user.id,
        },
        format="json",
    )

    assert response.status_code == status.HTTP_201_CREATED

    todo = Todo.objects.get(
        id=response.data["id"],
    )

    assert todo.user == user
    assert todo.user != another_user

def test_retrieve_nonexistent_todo(
    authenticated_client,
):
    nonexistent_id = "00000000-0000-0000-0000-000000000000"

    response = authenticated_client.get(
        f"{TODOS_URL}{nonexistent_id}/",
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND

def test_deleted_todo_cannot_be_updated(
    authenticated_client,
    user,
):
    todo = Todo.objects.create(
        user=user,
        title="Deleted Todo",
        is_deleted=True,
    )

    response = authenticated_client.patch(
        todo_detail_url(todo),
        {
            "title": "Trying to update",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND

def test_deleted_todo_cannot_be_deleted_again(
    authenticated_client,
    user,
):
    todo = Todo.objects.create(
        user=user,
        title="Already deleted",
        is_deleted=True,
    )

    response = authenticated_client.delete(
        todo_detail_url(todo),
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND

def test_create_todo_strips_description_whitespace(authenticated_client):
    response = authenticated_client.post(
        "/api/v1/todos/",
        {
            "title": "Test Todo",
            "description": "   Some description   ",
            "status": "pending",
            "priority": 2,
        },
        format="json",
    )

    assert response.status_code == 201
    assert response.data["description"] == "Some description"


def test_create_todo_rejects_whitespace_only_description(
    authenticated_client,
):
    response = authenticated_client.post(
        "/api/v1/todos/",
        {
            "title": "Test Todo",
            "description": "   ",
            "status": "pending",
            "priority": 2,
        },
        format="json",
    )

    assert response.status_code == 201
    assert response.data["description"] == ""


def test_cleanup_deleted_todos_deletes_old_deleted_todos(db, user):
    old_date = timezone.now() - timedelta(days=31)

    todo = Todo.objects.create(
        user=user,
        title="Old deleted todo",
        is_deleted=True,
    )

    Todo.objects.filter(pk=todo.pk).update(
        updated_at=old_date,
    )

    result = cleanup_deleted_todos.apply().get()

    assert result["deleted_count"] == 1
    assert not Todo.objects.filter(pk=todo.pk).exists()


def test_cleanup_deleted_todos_keeps_recent_deleted_todos(db, user):
    todo = Todo.objects.create(
        user=user,
        title="Recently deleted todo",
        is_deleted=True,
    )

    result = cleanup_deleted_todos.apply().get()

    assert result["deleted_count"] == 0
    assert Todo.objects.filter(pk=todo.pk).exists()


def test_cleanup_deleted_todos_keeps_active_todos(db, user):
    todo = Todo.objects.create(
        user=user,
        title="Active todo",
        is_deleted=False,
    )

    result = cleanup_deleted_todos.apply().get()

    assert result["deleted_count"] == 0
    assert Todo.objects.filter(pk=todo.pk).exists()