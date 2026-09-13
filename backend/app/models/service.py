"""Service model: the core government service entity."""
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.base import IDMixin, TimestampMixin
from app.models.enums import ServiceStatus

if TYPE_CHECKING:
    from app.models.category import Category
    from app.models.source import Source


class Service(Base, IDMixin, TimestampMixin):
    """A government service (e.g., issuing a passport for the first time)."""

    __tablename__ = "services"

    # Identity
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    eligibility: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relations
    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    primary_source_id: Mapped[int | None] = mapped_column(
        ForeignKey("sources.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # External
    official_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # Verification
    status: Mapped[ServiceStatus] = mapped_column(
        SAEnum(ServiceStatus, name="service_status", native_enum=False),
        default=ServiceStatus.DRAFT,
        nullable=False,
        index=True,
    )
    last_verified_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True,
    )
    verified_by: Mapped[str | None] = mapped_column(String(100), nullable=True)

    # Flags
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)

    # Relationships
    category: Mapped["Category"] = relationship(back_populates="services")
    primary_source: Mapped["Source | None"] = relationship(back_populates="services")

    def __repr__(self) -> str:
        return f"<Service id={self.id} slug={self.slug!r} status={self.status.value}>"