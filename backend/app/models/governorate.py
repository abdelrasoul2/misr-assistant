"""Governorate model: the 27 governorates of Egypt."""
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.base import IDMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.government_entity import GovernmentEntity
    # GovernmentOffice relationship will be added in STEP 7B


class Governorate(Base, IDMixin, TimestampMixin):
    """An Egyptian governorate (محافظة)."""

    __tablename__ = "governorates"

    name_ar: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    name_en: Mapped[str] = mapped_column(String(50), nullable=False)
    code: Mapped[str] = mapped_column(String(10), unique=True, nullable=False, index=True)
    region: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    latitude: Mapped[Decimal | None] = mapped_column(Numeric(9, 6), nullable=True)
    longitude: Mapped[Decimal | None] = mapped_column(Numeric(9, 6), nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)

    # Relationships
    entities: Mapped[list["GovernmentEntity"]] = relationship(
        back_populates="governorate"
    )

    def __repr__(self) -> str:
        return f"<Governorate id={self.id} code={self.code!r} name={self.name_ar!r}>"