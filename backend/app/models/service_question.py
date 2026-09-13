"""ServiceQuestion model: questions that drive the interactive checklist."""
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Enum as SAEnum, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.base import IDMixin, TimestampMixin
from app.models.enums import QuestionType

if TYPE_CHECKING:
    from app.models.service import Service
    from app.models.service_question_option import ServiceQuestionOption


class ServiceQuestion(Base, IDMixin, TimestampMixin):
    """A question asked to the user to determine exact requirements."""

    __tablename__ = "service_questions"

    service_id: Mapped[int] = mapped_column(
        ForeignKey("services.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    question: Mapped[str] = mapped_column(Text, nullable=False)
    question_type: Mapped[QuestionType] = mapped_column(
        SAEnum(QuestionType, name="question_type", native_enum=False),
        default=QuestionType.BOOLEAN,
        nullable=False,
    )
    help_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_required: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    service: Mapped["Service"] = relationship(back_populates="questions")
    options: Mapped[list["ServiceQuestionOption"]] = relationship(
        back_populates="question",
        cascade="all, delete-orphan",
        order_by="ServiceQuestionOption.sort_order",
    )

    def __repr__(self) -> str:
        return f"<ServiceQuestion id={self.id} type={self.question_type.value}>"