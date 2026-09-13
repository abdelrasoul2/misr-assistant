"""Pydantic schemas for EmergencyHotline."""
from datetime import datetime

from pydantic import Field

from app.models.enums import HotlineType
from app.schemas.common import BaseSchema


class EmergencyHotlineBase(BaseSchema):
    name: str = Field(..., min_length=1, max_length=200)
    number: str = Field(..., min_length=1, max_length=50)
    hotline_type: HotlineType
    description: str | None = None
    sector_id: int | None = None
    governorate_id: int | None = None
    source_id: int | None = None
    is_national: bool = True
    is_24_7: bool = True
    is_toll_free: bool = True
    priority: int = Field(default=5, ge=1, le=10)
    notes: str | None = None
    is_active: bool = True


class EmergencyHotlineCreate(EmergencyHotlineBase):
    pass


class EmergencyHotlineUpdate(BaseSchema):
    name: str | None = None
    number: str | None = None
    hotline_type: HotlineType | None = None
    description: str | None = None
    sector_id: int | None = None
    governorate_id: int | None = None
    source_id: int | None = None
    is_national: bool | None = None
    is_24_7: bool | None = None
    is_toll_free: bool | None = None
    priority: int | None = Field(default=None, ge=1, le=10)
    notes: str | None = None
    is_active: bool | None = None


class EmergencyHotlineRead(EmergencyHotlineBase):
    id: int
    created_at: datetime
    updated_at: datetime