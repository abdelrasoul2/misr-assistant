"""Source model: official sources used to verify service information."""
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.base import IDMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.service import Service


class Source(Base, IDMixin, TimestampMixin):
    """An official source (government body, ministry, portal)."""

    __tablename__ = "sources"

    name: Mapped[str] = mapped_column(String(200), nullable=False)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    official: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    checked_by: Mapped[str | None] = mapped_column(String(100), nullable=True)

    # Relationships
    services: Mapped[list["Service"]] = relationship(back_populates="primary_source")

    def __repr__(self) -> str:
        return f"<Source id={self.id} name={self.name!r} official={self.official}>"