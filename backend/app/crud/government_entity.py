"""CRUD for GovernmentEntity."""
from app.crud.base import CRUDBase
from app.models.government_entity import GovernmentEntity
from app.schemas.government_entity import (
    GovernmentEntityCreate,
    GovernmentEntityUpdate,
)


class CRUDGovernmentEntity(
    CRUDBase[GovernmentEntity, GovernmentEntityCreate, GovernmentEntityUpdate]
):
    pass


government_entity = CRUDGovernmentEntity(GovernmentEntity)