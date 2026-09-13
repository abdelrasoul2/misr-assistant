"""ServiceQuestionOption model: answer choices for a service question."""
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.base import IDMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.service_question import ServiceQuestion


class ServiceQuestionOption(Base, IDMixin, TimestampMixin):
    """A selectable option for a service question."""

    __tablename__ = "service_question_options"
    __table_args__ = (
        UniqueConstraint("question_id", "value", name="uq_sqo_question_value"),
    )

    question_id: Mapped[int] = mapped_column(
        ForeignKey("service_questions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    label: Mapped[str] = mapped_column(String(200), nullable=False)
    value: Mapped[str] = mapped_column(String(100), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationships
    question: Mapped["ServiceQuestion"] = relationship(back_populates="options")

    def __repr__(self) -> str:
        return f"<ServiceQuestionOption id={self.id} label={self.label!r}>"