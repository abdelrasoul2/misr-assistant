"""Pydantic schemas for search."""
from pydantic import BaseModel, Field

from app.schemas.common import BaseSchema


class SearchResultItem(BaseSchema):
    id: int
    name: str
    slug: str
    description: str | None = None
    category_id: int
    match_type: str  # "alias" | "name" | "description"
    match_score: int
    matched_phrase: str | None = None  # لو match_type == alias


class SearchResponse(BaseSchema):
    query: str
    normalized_query: str
    total: int
    items: list[SearchResultItem]


class SuggestItem(BaseSchema):
    text: str
    type: str  # "service" | "alias"
    service_id: int | None = None
    service_slug: str | None = None


class SuggestResponse(BaseSchema):
    query: str
    items: list[SuggestItem]