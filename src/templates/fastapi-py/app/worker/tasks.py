from app.worker.celery_app import celery_app


@celery_app.task(name="app.worker.tasks.send_welcome_email")
def send_welcome_email(email: str) -> str:
    return f"queued welcome email for {email}"
