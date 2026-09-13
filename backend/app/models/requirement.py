"""Requirement model: documents required for a service."""
from typing import TYPE_CHECKING

from sqlalchemy import Enum as SAEnum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.base import IDMixin, TimestampMixin
from app.models.enums import RequirementType

if TYPE_CHECKING:
    from app.models.service import Service
    from app.models.source import Source


class Requirement(Base, IDMixin, TimestampMixin):
    """A document or piece of information required for a service."""

    __tablename__ = "requirements"

    service_id: Mapped[int] = mapped_column(
        ForeignKey("services.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    source_id: Mapped[int | None] = mapped_column(
        ForeignKey("sources.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    title: Mapped[str] = mapped_column(String(300), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    requirement_type: Mapped[RequirementType] = mapped_column(
        SAEnum(RequirementType, name="requirement_type", native_enum=False),
        default=RequirementType.REQUIRED,
        nullable=False,
    )
    condition_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationships
    service: Mapped["Service"] = relationship(back_populates="requirements")
    source: Mapped["Source | None"] = relationship()

    def __repr__(self) -> str:
        return f"<Requirement id={self.id} title={self.title!r} type={self.requirement_type.value}>"