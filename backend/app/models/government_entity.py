"""GovernmentEntity model: ministries, agencies, directorates, administrations."""
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Enum as SAEnum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.base import IDMixin, TimestampMixin
from app.models.enums import EntityType

if TYPE_CHECKING:
    from app.models.governorate import Governorate
    from app.models.sector import Sector
    from app.models.source import Source


class GovernmentEntity(Base, IDMixin, TimestampMixin):
    """A government entity: ministry, authority, agency, directorate, etc."""

    __tablename__ = "government_entities"

    name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(200), unique=True, nullable=False, index=True)
    short_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    entity_type: Mapped[EntityType] = mapped_column(
        SAEnum(EntityType, name="entity_type", native_enum=False),
        nullable=False,
        index=True,
    )

    sector_id: Mapped[int | None] = mapped_column(
        ForeignKey("sectors.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    parent_id: Mapped[int | None] = mapped_column(
        ForeignKey("government_entities.id", ondelete="SET NULL"),
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

    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    website: Mapped[str | None] = mapped_column(String(500), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    email: Mapped[str | None] = mapped_column(String(100), nullable=True)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    logo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    sector: Mapped["Sector | None"] = relationship(back_populates="entities")
    governorate: Mapped["Governorate | None"] = relationship(back_populates="entities")
    source: Mapped["Source | None"] = relationship()
    parent: Mapped["GovernmentEntity | None"] = relationship(
        remote_side="GovernmentEntity.id", back_populates="children"
    )
    children: Mapped[list["GovernmentEntity"]] = relationship(back_populates="parent")

    def __repr__(self) -> str:
        return f"<GovernmentEntity id={self.id} type={self.entity_type.value} name={self.name!r}>"