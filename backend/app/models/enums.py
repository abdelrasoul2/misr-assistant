"""Enums shared across ORM models."""
from enum import Enum


class ServiceStatus(str, Enum):
    """Verification lifecycle status for a service."""

    DRAFT = "draft"
    UNDER_REVIEW = "under_review"
    VERIFIED = "verified"
    PUBLISHED = "published"
    NEEDS_REVIEW = "needs_review"
    OUTDATED = "outdated"


class RequirementType(str, Enum):
    """How required a document is."""

    REQUIRED = "required"
    OPTIONAL = "optional"
    CONDITIONAL = "conditional"


class QuestionType(str, Enum):
    """Type of question used in the interactive checklist."""

    BOOLEAN = "boolean"
    SINGLE_CHOICE = "single_choice"
    MULTIPLE_CHOICE = "multiple_choice"


class EntityType(str, Enum):
    """Type of government entity in the hierarchy."""

    MINISTRY = "ministry"
    AUTHORITY = "authority"
    AGENCY = "agency"
    DIRECTORATE = "directorate"
    ADMINISTRATION = "administration"
    COUNCIL = "council"
    OTHER = "other"


class OfficeType(str, Enum):
    """Type of physical government office."""

    CIVIL_REGISTRY = "civil_registry"
    TRAFFIC = "traffic"
    PASSPORT = "passport"
    REAL_ESTATE = "real_estate"
    TAX = "tax"
    COURT = "court"
    NOTARY = "notary"
    MUNICIPALITY = "municipality"
    POST_OFFICE = "post_office"
    HEALTH = "health"
    EDUCATION = "education"
    POLICE = "police"
    OTHER = "other"


class HotlineType(str, Enum):
    """Type of emergency hotline."""

    POLICE = "police"
    AMBULANCE = "ambulance"
    FIRE = "fire"
    GAS = "gas"
    WATER = "water"
    ELECTRICITY = "electricity"
    SEWAGE = "sewage"
    CONSUMER = "consumer"
    HEALTH = "health"
    COMPLAINTS = "complaints"
    ROADS = "roads"
    OTHER = "other"