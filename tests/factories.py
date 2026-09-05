import factory
from factory.django import DjangoModelFactory

from accounts.models import User
from todos.models import Todo

class UserFactory(DjangoModelFactory):
    class Meta:
        model = User

    username = factory.Sequence(
        lambda n: f"user{n}"
    )

    email = factory.LazyAttribute(
        lambda obj: f"{obj.username}@example.com"
    )

    password = factory.LazyFunction(
        lambda: "TestPassword123!"
    )

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        password = kwargs.pop(
            "password",
            "TestPassword123!",
        )

        user = model_class.objects.create_user(
            *args,
            password=password,
            **kwargs,
        )

        return user

        
class TodoFactory(DjangoModelFactory):
    class Meta:
        model = Todo

    user = factory.SubFactory(UserFactory)

    title = factory.Sequence(
        lambda n: f"Test Todo {n}"
    )

    description = factory.LazyAttribute(
        lambda obj: f"Description for {obj.title}"
    )

    status = Todo.Status.PENDING

    priority = Todo.Priority.MEDIUM