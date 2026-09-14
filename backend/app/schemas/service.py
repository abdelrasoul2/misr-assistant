"""Pydantic schemas for Service and nested resources."""
from datetime import datetime
from decimal import Decimal

from pydantic import Field

from app.models.enums import QuestionType, RequirementType, ServiceStatus
from app.schemas.common import BaseSchema


class ServiceBase(BaseSchema):
    name: str = Field(..., min_length=1, max_length=200)
    slug: str = Field(..., min_length=1, max_length=200)
    description: str | None = None
    eligibility: str | None = None
    category_id: int
    primary_source_id: int | None = None
    official_url: str | None = Field(default=None, max_length=500)


class ServiceCreate(ServiceBase):
    status: ServiceStatus = ServiceStatus.DRAFT
    is_active: bool = True


class ServiceUpdate(BaseSchema):
    name: str | None = None
    slug: str | None = None
    description: str | None = None
    eligibility: str | None = None
    category_id: int | None = None
    primary_source_id: int | None = None
    official_url: str | None = None
    status: ServiceStatus | None = None
    last_verified_at: datetime | None = None
    verified_by: str | None = None
    is_active: bool | None = None


class ServiceRead(ServiceBase):
    id: int
    status: ServiceStatus
    last_verified_at: datetime | None = None
    verified_by: str | None = None
    is_active: bool
    created_at: datetime
    updated_at: datetime


class RequirementBase(BaseSchema):
    title: str = Field(..., min_length=1, max_length=300)
    description: str | None = None
    requirement_type: RequirementType = RequirementType.REQUIRED
    condition_note: str | None = None
    notes: str | None = None
    sort_order: int = 0
    source_id: int | None = None


class RequirementCreate(RequirementBase):
    service_id: int


class RequirementUpdate(BaseSchema):
    title: str | None = None
    description: str | None = None
    requirement_type: RequirementType | None = None
    condition_note: str | None = None
    notes: str | None = None
    sort_order: int | None = None
    source_id: int | None = None


class RequirementRead(RequirementBase):
    id: int
    service_id: int
    created_at: datetime
    updated_at: datetime


class StepBase(BaseSchema):
    step_number: int = Field(..., ge=1)
    title: str = Field(..., min_length=1, max_length=300)
    description: str | None = None
    source_id: int | None = None


class StepCreate(StepBase):
    service_id: int


class StepUpdate(BaseSchema):
    step_number: int | None = Field(default=None, ge=1)
    title: str | None = None
    description: str | None = None
    source_id: int | None = None


class StepRead(StepBase):
    id: int
    service_id: int
    created_at: datetime
    updated_at: datetime


class FeeBase(BaseSchema):
    amount: Decimal
    currency: str = "EGP"
    description: str | None = None
    effective_from: datetime
    effective_until: datetime | None = None
    notes: str | None = None


class FeeCreate(FeeBase):
    service_id: int
    source_id: int


class FeeUpdate(BaseSchema):
    amount: Decimal | None = None
    currency: str | None = None
    description: str | None = None
    effective_from: datetime | None = None
    effective_until: datetime | None = None
    notes: str | None = None
    source_id: int | None = None


class FeeRead(FeeBase):
    id: int
    service_id: int
    source_id: int
    created_at: datetime
    updated_at: datetime


class LocationBase(BaseSchema):
    governorate: str = Field(..., min_length=1, max_length=50)
    city: str | None = Field(default=None, max_length=100)
    address: str
    latitude: Decimal | None = None
    longitude: Decimal | None = None
    working_hours: str | None = Field(default=None, max_length=200)
    phone: str | None = Field(default=None, max_length=50)
    source_id: int | None = None


class LocationCreate(LocationBase):
    service_id: int


class LocationUpdate(BaseSchema):
    governorate: str | None = None
    city: str | None = None
    address: str | None = None
    latitude: Decimal | None = None
    longitude: Decimal | None = None
    working_hours: str | None = None
    phone: str | None = None
    source_id: int | None = None


class LocationRead(LocationBase):
    id: int
    service_id: int
    created_at: datetime
    updated_at: datetime


class ServiceAliasBase(BaseSchema):
    phrase: str = Field(..., min_length=1, max_length=300)
    normalized: str = Field(..., min_length=1, max_length=300)
    weight: int = Field(default=100, ge=1, le=1000)


class ServiceAliasCreate(ServiceAliasBase):
    service_id: int


class ServiceAliasRead(ServiceAliasBase):
    id: int
    service_id: int
    created_at: datetime
    updated_at: datetime


class ServiceQuestionBase(BaseSchema):
    question: str
    question_type: QuestionType = QuestionType.BOOLEAN
    help_text: str | None = None
    sort_order: int = 0
    is_required: bool = True


class ServiceQuestionCreate(ServiceQuestionBase):
    service_id: int


class ServiceQuestionUpdate(BaseSchema):
    question: str | None = None
    question_type: QuestionType | None = None
    help_text: str | None = None
    sort_order: int | None = None
    is_required: bool | None = None


class ServiceQuestionRead(ServiceQuestionBase):
    id: int
    service_id: int
    created_at: datetime
    updated_at: datetime


class ServiceQuestionOptionBase(BaseSchema):
    label: str = Field(..., min_length=1, max_length=200)
    value: str = Field(..., min_length=1, max_length=100)
    sort_order: int = 0


class ServiceQuestionOptionCreate(ServiceQuestionOptionBase):
    question_id: int


class ServiceQuestionOptionRead(ServiceQuestionOptionBase):
    id: int
    question_id: int
    created_at: datetime
    updated_at: datetime