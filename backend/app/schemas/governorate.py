"""Pydantic schemas for Governorate."""
from datetime import datetime
from decimal import Decimal

from pydantic import Field

from app.schemas.common import BaseSchema


class GovernorateBase(BaseSchema):
    name_ar: str = Field(..., min_length=1, max_length=50)
    name_en: str = Field(..., min_length=1, max_length=50)
    code: str = Field(..., min_length=2, max_length=10)
    region: str = Field(..., min_length=1, max_length=50)
    latitude: Decimal | None = None
    longitude: Decimal | None = None
    is_active: bool = True


class GovernorateCreate(GovernorateBase):
    pass


class GovernorateUpdate(BaseSchema):
    name_ar: str | None = None
    name_en: str | None = None
    region: str | None = None
    latitude: Decimal | None = None
    longitude: Decimal | None = None
    is_active: bool | None = None


class GovernorateRead(GovernorateBase):
    id: int
    created_at: datetime
    updated_at: datetime