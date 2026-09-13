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