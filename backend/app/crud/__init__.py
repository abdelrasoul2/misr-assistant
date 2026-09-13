"""CRUD operations for Misr Assistant."""
from app.crud.base import CRUDBase
from app.crud.category import CRUDCategory, category

__all__ = [
    "CRUDBase",
    "CRUDCategory",
    "category",
]