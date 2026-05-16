from celery import Celery

from app.core.config import settings

celery_app = Celery(
    "forge_fastapi",
    broker=settings.redis_url,
    backend=settings.redis_url,
)

celery_app.conf.task_routes = {
    "app.worker.tasks.send_welcome_email": {"queue": "default"},
}
