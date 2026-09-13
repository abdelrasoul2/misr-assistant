"""CRUD for GovernmentOffice."""
from app.crud.base import CRUDBase
from app.models.government_office import GovernmentOffice
from app.schemas.government_office import (
    GovernmentOfficeCreate,
    GovernmentOfficeUpdate,
)


class CRUDGovernmentOffice(
    CRUDBase[GovernmentOffice, GovernmentOfficeCreate, GovernmentOfficeUpdate]
):
    pass


government_office = CRUDGovernmentOffice(GovernmentOffice)