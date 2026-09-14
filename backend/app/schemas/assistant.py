"""Pydantic schemas for the AI Assistant."""
from typing import Literal

from pydantic import Field

from app.schemas.common import BaseSchema


class ChatMessage(BaseSchema):
    """A single message in the conversation."""
    role: Literal["user", "assistant"]
    content: str = Field(..., min_length=1, max_length=4000)


class AssistantRequest(BaseSchema):
    """Request to the AI assistant."""
    message: str = Field(..., min_length=1, max_length=2000)
    history: list[ChatMessage] = Field(default_factory=list, max_length=20)


class SuggestedService(BaseSchema):
    """A service suggested by the assistant."""
    id: int
    name: str
    slug: str
    description: str | None = None
    category_id: int


class AssistantSource(BaseSchema):
    """A source cited by the assistant."""
    name: str
    url: str | None = None
    type: str  # "official" | "internal"
    verified_at: str | None = None


class AssistantResponse(BaseSchema):
    """Response from the AI assistant."""
    reply: str
    suggested_services: list[SuggestedService] = Field(default_factory=list)
    sources: list[AssistantSource] = Field(default_factory=list)
    intent: str = "service"
    disclaimer: str = (
        "المعلومات للاسترشاد فقط. تحقق دائماً من المصدر الرسمي "
        "قبل الشروع في أي معاملة."
    )