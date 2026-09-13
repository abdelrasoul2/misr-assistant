"""Sector model: government sectors (health, education, justice, etc.)."""
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.base import IDMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.government_entity import GovernmentEntity


class Sector(Base, IDMixin, TimestampMixin):
    """A government sector."""

    __tablename__ = "sectors"

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    icon: Mapped[str | None] = mapped_column(String(10), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    color: Mapped[str | None] = mapped_column(String(20), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    parent_id: Mapped[int | None] = mapped_column(
        ForeignKey("sectors.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)

    # Relationships
    entities: Mapped[list["GovernmentEntity"]] = relationship(back_populates="sector")
    parent: Mapped["Sector | None"] = relationship(
        remote_side="Sector.id", back_populates="children"
    )
    children: Mapped[list["Sector"]] = relationship(back_populates="parent")

    def __repr__(self) -> str:
        return f"<Sector id={self.id} slug={self.slug!r} name={self.name!r}>"