"""Pydantic schemas for authentication."""
from datetime import datetime

from pydantic import EmailStr, Field

from app.schemas.common import BaseSchema


class UserBase(BaseSchema):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=200)


class UserRegister(UserBase):
    """Payload to register a new user."""
    password: str = Field(..., min_length=8, max_length=100)


class UserLogin(BaseSchema):
    """Payload to log in."""
    email: EmailStr
    password: str


class UserRead(UserBase):
    """User data returned to the client."""
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: datetime


class Token(BaseSchema):
    """JWT access token response."""
    access_token: str
    token_type: str = "bearer"


class TokenWithUser(Token):
    """Access token + user data."""
    user: UserRead