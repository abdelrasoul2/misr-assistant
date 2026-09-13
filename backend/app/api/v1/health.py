from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.session import get_db

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check() -> dict:
    """Return service health status."""
    return {
        "status": "ok",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "env": settings.APP_ENV,
    }


@router.get("/health/db")
async def health_db(db: AsyncSession = Depends(get_db)) -> dict:
    """Check database connectivity."""
    try:
        result = await db.execute(text("SELECT 1"))
        value = result.scalar_one()
        return {
            "status": "ok",
            "database": "connected",
            "dialect": db.bind.dialect.name if db.bind else "unknown",
            "test_query": value,
        }
    except Exception as exc:
        return {
            "status": "error",
            "database": "disconnected",
            "error": str(exc),
        }
