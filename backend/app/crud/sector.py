"""CRUD for Sector."""
from app.crud.base import CRUDBase
from app.models.sector import Sector
from app.schemas.sector import SectorCreate, SectorUpdate


class CRUDSector(CRUDBase[Sector, SectorCreate, SectorUpdate]):
    pass


sector = CRUDSector(Sector)