from app.db.base import Base
from app.db.session import engine


async def init_db() -> None:
    """Create all tables. For development only — use Alembic in production."""
    # Import models here so they register with Base.metadata
    # from app import models  # noqa: F401  (will be added in STEP 4)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def close_db() -> None:
    """Dispose of the engine connection pool."""
    await engine.dispose()
