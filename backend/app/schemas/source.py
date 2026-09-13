"""Pydantic schemas for Source."""
from datetime import datetime

from pydantic import Field

from app.schemas.common import BaseSchema


class SourceBase(BaseSchema):
    """Shared fields for Source."""

    name: str = Field(..., min_length=1, max_length=200)
    url: str = Field(..., min_length=1, max_length=500)
    description: str | None = None
    official: bool = True


class SourceCreate(SourceBase):
    """Schema for creating a Source."""

    checked_by: str | None = Field(default=None, max_length=100)


class SourceUpdate(BaseSchema):
    """Schema for updating a Source (all optional)."""

    name: str | None = Field(default=None, min_length=1, max_length=200)
    url: str | None = Field(default=None, min_length=1, max_length=500)
    description: str | None = None
    official: bool | None = None
    checked_by: str | None = Field(default=None, max_length=100)


class SourceRead(SourceBase):
    """Schema for reading a Source from the API."""

    id: int
    verified_at: datetime | None = None
    checked_by: str | None = None
    created_at: datetime
    updated_at: datetime


class SourceVerify(BaseSchema):
    """Schema for marking a source as verified."""

    checked_by: str = Field(..., min_length=1, max_length=100)