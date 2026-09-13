"""CRUD operations for Misr Assistant."""
from app.crud.base import CRUDBase
from app.crud.category import CRUDCategory, category
from app.crud.emergency_hotline import CRUDEmergencyHotline, emergency_hotline
from app.crud.government_entity import CRUDGovernmentEntity, government_entity
from app.crud.government_office import CRUDGovernmentOffice, government_office
from app.crud.governorate import CRUDGovernorate, governorate
from app.crud.sector import CRUDSector, sector
from app.crud.source import CRUDSource, source

__all__ = [
    "CRUDBase",
    "CRUDCategory",
    "CRUDEmergencyHotline",
    "CRUDGovernmentEntity",
    "CRUDGovernmentOffice",
    "CRUDGovernorate",
    "CRUDSector",
    "CRUDSource",
    "category",
    "emergency_hotline",
    "government_entity",
    "government_office",
    "governorate",
    "sector",
    "source",
]