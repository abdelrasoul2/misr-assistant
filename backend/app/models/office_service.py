"""Many-to-many link between offices and services."""
from sqlalchemy import Column, ForeignKey, Integer, Table

from app.db.base import Base

office_services = Table(
    "office_services",
    Base.metadata,
    Column(
        "office_id",
        Integer,
        ForeignKey("government_offices.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "service_id",
        Integer,
        ForeignKey("services.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)