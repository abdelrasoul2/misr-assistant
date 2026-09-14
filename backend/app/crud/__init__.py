"""CRUD operations for Misr Assistant."""
from app.crud.base import CRUDBase
from app.crud.category import CRUDCategory, category
from app.crud.emergency_hotline import CRUDEmergencyHotline, emergency_hotline
from app.crud.government_entity import CRUDGovernmentEntity, government_entity
from app.crud.government_office import CRUDGovernmentOffice, government_office
from app.crud.governorate import CRUDGovernorate, governorate
from app.crud.sector import CRUDSector, sector
from app.crud.service import (
    CRUDFee,
    CRUDLocation,
    CRUDRequirement,
    CRUDService,
    CRUDServiceAlias,
    CRUDServiceQuestion,
    CRUDServiceQuestionOption,
    CRUDStep,
    fee,
    location,
    requirement,
    service,
    service_alias,
    service_question,
    service_question_option,
    step,
)
from app.crud.source import CRUDSource, source
from app.crud.user import CRUDUser, user

__all__ = [
    "CRUDBase",
    "CRUDCategory",
    "CRUDEmergencyHotline",
    "CRUDFee",
    "CRUDGovernmentEntity",
    "CRUDGovernmentOffice",
    "CRUDGovernorate",
    "CRUDLocation",
    "CRUDRequirement",
    "CRUDSector",
    "CRUDService",
    "CRUDServiceAlias",
    "CRUDServiceQuestion",
    "CRUDServiceQuestionOption",
    "CRUDSource",
    "CRUDStep",
    "CRUDUser",
    "category",
    "emergency_hotline",
    "fee",
    "government_entity",
    "government_office",
    "governorate",
    "location",
    "requirement",
    "sector",
    "service",
    "service_alias",
    "service_question",
    "service_question_option",
    "source",
    "step",
    "user",
]