"""Pydantic schemas for Category."""
from datetime import datetime

from pydantic import Field

from app.schemas.common import BaseSchema


class CategoryBase(BaseSchema):
    """Shared fields for Category."""

    name: str = Field(..., min_length=1, max_length=100)
    slug: str = Field(..., min_length=1, max_length=100, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    description: str | None = None
    icon: str | None = Field(default=None, max_length=50)
    sort_order: int = Field(default=0, ge=0)
    is_active: bool = True


class CategoryCreate(CategoryBase):
    """Schema for creating a Category."""

    pass


class CategoryUpdate(BaseSchema):
    """Schema for updating a Category (all fields optional)."""

    name: str | None = Field(default=None, min_length=1, max_length=100)
    slug: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
        pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$",
    )
    description: str | None = None
    icon: str | None = Field(default=None, max_length=50)
    sort_order: int | None = Field(default=None, ge=0)
    is_active: bool | None = None


class CategoryRead(CategoryBase):
    """Schema for reading a Category from the API."""

    id: int
    created_at: datetime
    updated_at: datetime