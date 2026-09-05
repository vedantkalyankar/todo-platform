import logging
from datetime import timedelta

from celery import shared_task
from django.db import OperationalError
from django.utils import timezone

from .models import Todo

logger = logging.getLogger(__name__)


@shared_task
def test_task():
    return "Celery is working!"


@shared_task(
    bind=True,
    autoretry_for=(OperationalError,),
    retry_backoff=True,
    retry_backoff_max=60,
    retry_jitter=True,
    retry_kwargs={"max_retries": 3},
    time_limit=300,
    soft_time_limit=240,
)
def cleanup_deleted_todos(self):
    cutoff = timezone.now() - timedelta(days=30)

    try:
        deleted_count, _ = Todo.objects.filter(
            is_deleted=True,
            updated_at__lt=cutoff,
        ).delete()

    except OperationalError:
        logger.exception(
            "Database operational error while cleaning deleted todos"
        )
        raise

    except Exception:
        logger.exception(
            "Unexpected error while cleaning deleted todos"
        )
        raise

    logger.info(
        "Deleted %s todos that were soft-deleted before %s",
        deleted_count,
        cutoff.isoformat(),
    )

    return {
        "deleted_count": deleted_count,
        "cutoff": cutoff.isoformat(),
    }