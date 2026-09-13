"""EmergencyHotline model: emergency contact numbers."""
from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    Enum as SAEnum,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.base import IDMixin, TimestampMixin
from app.models.enums import HotlineType

if TYPE_CHECKING:
    from app.models.governorate import Governorate
    from app.models.sector import Sector
    from app.models.source import Source


class EmergencyHotline(Base, IDMixin, TimestampMixin):
    """An emergency contact number."""

    __tablename__ = "emergency_hotlines"

    name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    number: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    hotline_type: Mapped[HotlineType] = mapped_column(
        SAEnum(HotlineType, name="hotline_type", native_enum=False),
        nullable=False,
        index=True,
    )
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    sector_id: Mapped[int | None] = mapped_column(
        ForeignKey("sectors.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    governorate_id: Mapped[int | None] = mapped_column(
        ForeignKey("governorates.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    source_id: Mapped[int | None] = mapped_column(
        ForeignKey("sources.id", ondelete="SET NULL"),
        nullable=True,
    )

    is_national: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_24_7: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_toll_free: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    priority: Mapped[int] = mapped_column(Integer, default=5, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    sector: Mapped["Sector | None"] = relationship()
    governorate: Mapped["Governorate | None"] = relationship()
    source: Mapped["Source | None"] = relationship()

    def __repr__(self) -> str:
        return f"<EmergencyHotline id={self.id} number={self.number!r} name={self.name!r}>"