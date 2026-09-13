"""GovernmentOffice model: physical offices where services are provided."""
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    Enum as SAEnum,
    ForeignKey,
    JSON,
    Numeric,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.base import IDMixin, TimestampMixin
from app.models.enums import OfficeType

if TYPE_CHECKING:
    from app.models.government_entity import GovernmentEntity
    from app.models.governorate import Governorate
    from app.models.service import Service
    from app.models.source import Source


class GovernmentOffice(Base, IDMixin, TimestampMixin):
    """A physical government office/branch."""

    __tablename__ = "government_offices"

    name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(200), unique=True, nullable=False, index=True)
    office_type: Mapped[OfficeType] = mapped_column(
        SAEnum(OfficeType, name="office_type", native_enum=False),
        nullable=False,
        index=True,
    )

    entity_id: Mapped[int | None] = mapped_column(
        ForeignKey("government_entities.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    governorate_id: Mapped[int] = mapped_column(
        ForeignKey("governorates.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    source_id: Mapped[int | None] = mapped_column(
        ForeignKey("sources.id", ondelete="SET NULL"),
        nullable=True,
    )

    city: Mapped[str | None] = mapped_column(String(100), nullable=True)
    district: Mapped[str | None] = mapped_column(String(100), nullable=True)
    address: Mapped[str] = mapped_column(Text, nullable=False)

    latitude: Mapped[Decimal | None] = mapped_column(Numeric(9, 6), nullable=True)
    longitude: Mapped[Decimal | None] = mapped_column(Numeric(9, 6), nullable=True)

    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    phone_alt: Mapped[str | None] = mapped_column(String(50), nullable=True)
    fax: Mapped[str | None] = mapped_column(String(50), nullable=True)
    email: Mapped[str | None] = mapped_column(String(100), nullable=True)

    working_hours: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    is_emergency: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_24_7: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    entity: Mapped["GovernmentEntity | None"] = relationship()
    governorate: Mapped["Governorate"] = relationship()
    source: Mapped["Source | None"] = relationship()
    services: Mapped[list["Service"]] = relationship(
        secondary="office_services",
        back_populates="offices",
    )

    def __repr__(self) -> str:
        return f"<GovernmentOffice id={self.id} type={self.office_type.value} name={self.name!r}>"