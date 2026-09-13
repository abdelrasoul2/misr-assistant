"""Location model: physical places where a service can be obtained."""
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.base import IDMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.service import Service
    from app.models.source import Source


class Location(Base, IDMixin, TimestampMixin):
    """A physical location where a service can be processed."""

    __tablename__ = "locations"

    service_id: Mapped[int] = mapped_column(
        ForeignKey("services.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    source_id: Mapped[int | None] = mapped_column(
        ForeignKey("sources.id", ondelete="SET NULL"),
        nullable=True,
    )

    governorate: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    city: Mapped[str | None] = mapped_column(String(100), nullable=True)
    address: Mapped[str] = mapped_column(Text, nullable=False)
    latitude: Mapped[Decimal | None] = mapped_column(Numeric(9, 6), nullable=True)
    longitude: Mapped[Decimal | None] = mapped_column(Numeric(9, 6), nullable=True)
    working_hours: Mapped[str | None] = mapped_column(String(200), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)

    # Relationships
    service: Mapped["Service"] = relationship(back_populates="locations")
    source: Mapped["Source | None"] = relationship()

    def __repr__(self) -> str:
        return f"<Location id={self.id} governorate={self.governorate!r} city={self.city!r}>"