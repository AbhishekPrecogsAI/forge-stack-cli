from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings

try:
    from app.core.logging import configure_logging
except ImportError:
    configure_logging = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    if configure_logging is not None:
        configure_logging()
    yield


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name, lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router, prefix=settings.api_v1_prefix)

    @app.get("/health", tags=["health"])
    async def health_root():
        return {"status": "ok", "service": settings.app_name}

    return app


app = create_app()
