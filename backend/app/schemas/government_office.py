"""Pydantic schemas for GovernmentOffice."""
from datetime import datetime
from decimal import Decimal

from pydantic import Field

from app.models.enums import OfficeType
from app.schemas.common import BaseSchema


class GovernmentOfficeBase(BaseSchema):
    name: str = Field(..., min_length=1, max_length=200)
    slug: str = Field(..., min_length=1, max_length=200)
    office_type: OfficeType
    entity_id: int | None = None
    governorate_id: int
    source_id: int | None = None
    city: str | None = Field(default=None, max_length=100)
    district: str | None = Field(default=None, max_length=100)
    address: str
    latitude: Decimal | None = None
    longitude: Decimal | None = None
    phone: str | None = Field(default=None, max_length=50)
    phone_alt: str | None = Field(default=None, max_length=50)
    fax: str | None = Field(default=None, max_length=50)
    email: str | None = Field(default=None, max_length=100)
    working_hours: dict | None = None
    is_emergency: bool = False
    is_24_7: bool = False
    notes: str | None = None
    is_active: bool = True


class GovernmentOfficeCreate(GovernmentOfficeBase):
    pass


class GovernmentOfficeUpdate(BaseSchema):
    name: str | None = None
    slug: str | None = None
    office_type: OfficeType | None = None
    entity_id: int | None = None
    governorate_id: int | None = None
    source_id: int | None = None
    city: str | None = None
    district: str | None = None
    address: str | None = None
    latitude: Decimal | None = None
    longitude: Decimal | None = None
    phone: str | None = None
    phone_alt: str | None = None
    fax: str | None = None
    email: str | None = None
    working_hours: dict | None = None
    is_emergency: bool | None = None
    is_24_7: bool | None = None
    notes: str | None = None
    is_active: bool | None = None


class GovernmentOfficeRead(GovernmentOfficeBase):
    id: int
    created_at: datetime
    updated_at: datetime