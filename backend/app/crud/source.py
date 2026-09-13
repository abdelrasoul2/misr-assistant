"""CRUD operations for Source."""
from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import CRUDBase
from app.models.source import Source
from app.schemas.source import SourceCreate, SourceUpdate


class CRUDSource(CRUDBase[Source, SourceCreate, SourceUpdate]):
    """Source-specific CRUD operations."""

    async def mark_verified(
        self,
        db: AsyncSession,
        *,
        db_obj: Source,
        checked_by: str,
    ) -> Source:
        """Mark a source as verified now."""
        db_obj.verified_at = datetime.now(timezone.utc)
        db_obj.checked_by = checked_by
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj


source = CRUDSource(Source)