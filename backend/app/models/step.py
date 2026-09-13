"""Step model: ordered execution steps for a service."""
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.base import IDMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.service import Service
    from app.models.source import Source


class Step(Base, IDMixin, TimestampMixin):
    """A single ordered step in the process of obtaining a service."""

    __tablename__ = "steps"
    __table_args__ = (
        UniqueConstraint("service_id", "step_number", name="uq_steps_service_step_number"),
    )

    service_id: Mapped[int] = mapped_column(
        ForeignKey("services.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    source_id: Mapped[int | None] = mapped_column(
        ForeignKey("sources.id", ondelete="SET NULL"),
        nullable=True,
    )

    step_number: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    service: Mapped["Service"] = relationship(back_populates="steps")
    source: Mapped["Source | None"] = relationship()

    def __repr__(self) -> str:
        return f"<Step id={self.id} service_id={self.service_id} #{self.step_number}>"