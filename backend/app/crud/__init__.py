"""CRUD operations for Misr Assistant."""
from app.crud.base import CRUDBase
from app.crud.category import CRUDCategory, category
from app.crud.government_entity import CRUDGovernmentEntity, government_entity
from app.crud.governorate import CRUDGovernorate, governorate
from app.crud.sector import CRUDSector, sector
from app.crud.source import CRUDSource, source

__all__ = [
    "CRUDBase",
    "CRUDCategory",
    "CRUDGovernmentEntity",
    "CRUDGovernorate",
    "CRUDSector",
    "CRUDSource",
    "category",
    "government_entity",
    "governorate",
    "sector",
    "source",
]