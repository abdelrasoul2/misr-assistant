"""Pydantic schemas for the Misr Assistant API."""
from app.schemas.assistant import (
    AssistantRequest,
    AssistantResponse,
    ChatMessage,
    SuggestedService,
)
from app.schemas.auth import (
    Token,
    TokenWithUser,
    UserBase,
    UserLogin,
    UserRead,
    UserRegister,
)
from app.schemas.category import (
    CategoryBase,
    CategoryCreate,
    CategoryRead,
    CategoryUpdate,
)
from app.schemas.common import (
    BaseSchema,
    ErrorResponse,
    MessageResponse,
    PaginatedResponse,
    PaginationParams,
    TimestampedSchema,
)
from app.schemas.emergency_hotline import (
    EmergencyHotlineBase,
    EmergencyHotlineCreate,
    EmergencyHotlineRead,
    EmergencyHotlineUpdate,
)
from app.schemas.government_entity import (
    GovernmentEntityBase,
    GovernmentEntityCreate,
    GovernmentEntityRead,
    GovernmentEntityUpdate,
)
from app.schemas.government_office import (
    GovernmentOfficeBase,
    GovernmentOfficeCreate,
    GovernmentOfficeRead,
    GovernmentOfficeUpdate,
)
from app.schemas.governorate import (
    GovernorateBase,
    GovernorateCreate,
    GovernorateRead,
    GovernorateUpdate,
)
from app.schemas.sector import (
    SectorBase,
    SectorCreate,
    SectorRead,
    SectorUpdate,
)
from app.schemas.search import (
    SearchResponse,
    SearchResultItem,
    SuggestItem,
    SuggestResponse,
)
from app.schemas.source import (
    SourceBase,
    SourceCreate,
    SourceRead,
    SourceUpdate,
    SourceVerify,
)

__all__ = [
    "BaseSchema",
    "CategoryBase",
    "CategoryCreate",
    "CategoryRead",
    "CategoryUpdate",
    "EmergencyHotlineBase",
    "EmergencyHotlineCreate",
    "EmergencyHotlineRead",
    "EmergencyHotlineUpdate",
    "ErrorResponse",
    "GovernmentEntityBase",
    "GovernmentEntityCreate",
    "GovernmentEntityRead",
    "GovernmentEntityUpdate",
    "GovernmentOfficeBase",
    "GovernmentOfficeCreate",
    "GovernmentOfficeRead",
    "GovernmentOfficeUpdate",
    "GovernorateBase",
    "GovernorateCreate",
    "GovernorateRead",
    "GovernorateUpdate",
    "MessageResponse",
    "PaginatedResponse",
    "PaginationParams",
    "SectorBase",
    "SectorCreate",
    "SectorRead",
    "SectorUpdate",
    "SourceBase",
    "SourceCreate",
    "SourceRead",
    "SourceUpdate",
    "SourceVerify",
    "TimestampedSchema",
    "Token",
    "TokenWithUser",
    "UserBase",
    "UserLogin",
    "UserRead",
    "UserRegister",
]