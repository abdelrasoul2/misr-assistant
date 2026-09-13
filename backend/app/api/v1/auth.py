"""Authentication endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.security import create_access_token, verify_password
from app.crud import user as crud_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import (
    TokenWithUser,
    UserLogin,
    UserRead,
    UserRegister,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/register",
    response_model=TokenWithUser,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    payload: UserRegister,
    db: AsyncSession = Depends(get_db),
) -> TokenWithUser:
    """Register a new user and return a JWT."""
    existing = await crud_user.get_by_email(db, payload.email)
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    user = await crud_user.create_user(
        db,
        email=payload.email,
        password=payload.password,
        full_name=payload.full_name,
    )

    token = create_access_token(subject=user.id, extra_claims={"email": user.email})
    return TokenWithUser(access_token=token, user=UserRead.model_validate(user))


@router.post("/login", response_model=TokenWithUser)
async def login(
    payload: UserLogin,
    db: AsyncSession = Depends(get_db),
) -> TokenWithUser:
    """Log in with email + password and return a JWT."""
    user = await crud_user.get_by_email(db, payload.email)
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user",
        )

    token = create_access_token(subject=user.id, extra_claims={"email": user.email})
    return TokenWithUser(access_token=token, user=UserRead.model_validate(user))


@router.get("/me", response_model=UserRead)
async def me(current_user: User = Depends(get_current_user)) -> UserRead:
    """Return the currently authenticated user."""
    return UserRead.model_validate(current_user)