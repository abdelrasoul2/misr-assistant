"""CRUD for Governorate."""
from app.crud.base import CRUDBase
from app.models.governorate import Governorate
from app.schemas.governorate import GovernorateCreate, GovernorateUpdate


class CRUDGovernorate(CRUDBase[Governorate, GovernorateCreate, GovernorateUpdate]):
    pass


governorate = CRUDGovernorate(Governorate)