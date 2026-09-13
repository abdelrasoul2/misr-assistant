"""Pydantic schemas for GovernmentEntity."""
from datetime import datetime

from pydantic import Field

from app.models.enums import EntityType
from app.schemas.common import BaseSchema


class GovernmentEntityBase(BaseSchema):
    name: str = Field(..., min_length=1, max_length=200)
    slug: str = Field(..., min_length=1, max_length=200)
    short_name: str | None = Field(default=None, max_length=100)
    entity_type: EntityType
    sector_id: int | None = None
    parent_id: int | None = None
    governorate_id: int | None = None
    source_id: int | None = None
    description: str | None = None
    website: str | None = Field(default=None, max_length=500)
    phone: str | None = Field(default=None, max_length=50)
    email: str | None = Field(default=None, max_length=100)
    address: str | None = None
    logo_url: str | None = Field(default=None, max_length=500)
    is_active: bool = True


class GovernmentEntityCreate(GovernmentEntityBase):
    pass


class GovernmentEntityUpdate(BaseSchema):
    name: str | None = None
    slug: str | None = None
    short_name: str | None = None
    entity_type: EntityType | None = None
    sector_id: int | None = None
    parent_id: int | None = None
    governorate_id: int | None = None
    source_id: int | None = None
    description: str | None = None
    website: str | None = None
    phone: str | None = None
    email: str | None = None
    address: str | None = None
    logo_url: str | None = None
    is_active: bool | None = None


class GovernmentEntityRead(GovernmentEntityBase):
    id: int
    created_at: datetime
    updated_at: datetime