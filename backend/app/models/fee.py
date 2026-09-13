"""Fee model: service fees with freshness tracking."""
from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.base import IDMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.service import Service
    from app.models.source import Source


class Fee(Base, IDMixin, TimestampMixin):
    """A fee associated with a service, with effective date range."""

    __tablename__ = "fees"

    service_id: Mapped[int] = mapped_column(
        ForeignKey("services.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    source_id: Mapped[int] = mapped_column(
        ForeignKey("sources.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="EGP", nullable=False)
    description: Mapped[str | None] = mapped_column(String(200), nullable=True)
    effective_from: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    effective_until: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    service: Mapped["Service"] = relationship(back_populates="fees")
    source: Mapped["Source"] = relationship()

    def __repr__(self) -> str:
        return f"<Fee id={self.id} amount={self.amount} {self.currency}>"