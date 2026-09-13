"""CRUD for EmergencyHotline."""
from app.crud.base import CRUDBase
from app.models.emergency_hotline import EmergencyHotline
from app.schemas.emergency_hotline import (
    EmergencyHotlineCreate,
    EmergencyHotlineUpdate,
)


class CRUDEmergencyHotline(
    CRUDBase[EmergencyHotline, EmergencyHotlineCreate, EmergencyHotlineUpdate]
):
    pass


emergency_hotline = CRUDEmergencyHotline(EmergencyHotline)