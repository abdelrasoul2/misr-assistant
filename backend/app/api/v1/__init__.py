"""API v1 routers."""
from app.api.v1 import (
    auth,
    categories,
    entities,
    governorates,
    health,
    hotlines,
    offices,
    sectors,
    service_nested,
    services,
    sources,
)

__all__ = [
    "auth",
    "categories",
    "entities",
    "governorates",
    "health",
    "hotlines",
    "offices",
    "sectors",
    "service_nested",
    "services",
    "sources",
]