from app.db.base import Base
from app.db.session import engine

# Import all models so they register with Base.metadata
from app import models  # noqa: F401


async def init_db() -> None:
    """Create all tables. For development only - use Alembic in production."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def close_db() -> None:
    """Dispose of the engine connection pool."""
    await engine.dispose()