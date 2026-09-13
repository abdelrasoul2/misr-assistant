"""Pydantic schemas for Sector."""
from datetime import datetime

from pydantic import Field

from app.schemas.common import BaseSchema


class SectorBase(BaseSchema):
    name: str = Field(..., min_length=1, max_length=100)
    slug: str = Field(..., min_length=1, max_length=100, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    icon: str | None = Field(default=None, max_length=10)
    description: str | None = None
    color: str | None = Field(default=None, max_length=20)
    sort_order: int = Field(default=0, ge=0)
    parent_id: int | None = None
    is_active: bool = True


class SectorCreate(SectorBase):
    pass


class SectorUpdate(BaseSchema):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    slug: str | None = Field(default=None, min_length=1, max_length=100)
    icon: str | None = Field(default=None, max_length=10)
    description: str | None = None
    color: str | None = Field(default=None, max_length=20)
    sort_order: int | None = Field(default=None, ge=0)
    parent_id: int | None = None
    is_active: bool | None = None


class SectorRead(SectorBase):
    id: int
    created_at: datetime
    updated_at: datetime