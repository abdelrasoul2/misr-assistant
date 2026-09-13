"""ServiceAlias model: alternative phrases users type to find a service."""
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.base import IDMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.service import Service


class ServiceAlias(Base, IDMixin, TimestampMixin):
    """An alternative phrase that maps to a service (for smart search)."""

    __tablename__ = "service_aliases"
    __table_args__ = (
        UniqueConstraint("service_id", "normalized", name="uq_service_aliases_service_normalized"),
    )

    service_id: Mapped[int] = mapped_column(
        ForeignKey("services.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    phrase: Mapped[str] = mapped_column(String(300), nullable=False)
    normalized: Mapped[str] = mapped_column(String(300), nullable=False, index=True)
    weight: Mapped[int] = mapped_column(Integer, default=100, nullable=False)

    # Relationships
    service: Mapped["Service"] = relationship(back_populates="aliases")

    def __repr__(self) -> str:
        return f"<ServiceAlias id={self.id} phrase={self.phrase!r}>"