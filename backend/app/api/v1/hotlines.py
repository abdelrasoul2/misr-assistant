"""EmergencyHotline API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import emergency_hotline as crud_hotline
from app.db.session import get_db
from app.models.enums import HotlineType
from app.schemas.common import PaginatedResponse
from app.schemas.emergency_hotline import (
    EmergencyHotlineCreate,
    EmergencyHotlineRead,
    EmergencyHotlineUpdate,
)

router = APIRouter(prefix="/hotlines", tags=["hotlines"])


@router.get("", response_model=PaginatedResponse[EmergencyHotlineRead])
async def list_hotlines(
    db: AsyncSession = Depends(get_db),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, ge=1, le=200),
    hotline_type: HotlineType | None = Query(default=None),
    is_national: bool | None = Query(default=None),
    governorate_id: int | None = Query(default=None),
    is_active: bool | None = Query(default=True),
) -> PaginatedResponse[EmergencyHotlineRead]:
    filters: dict = {}
    if hotline_type is not None:
        filters["hotline_type"] = hotline_type
    if is_national is not None:
        filters["is_national"] = is_national
    if governorate_id is not None:
        filters["governorate_id"] = governorate_id
    if is_active is not None:
        filters["is_active"] = is_active

    total = await crud_hotline.count(db, filters=filters or None)
    items = await crud_hotline.list(
        db,
        skip=(page - 1) * page_size,
        limit=page_size,
        order_by="priority",
        filters=filters or None,
    )
    return PaginatedResponse[EmergencyHotlineRead].create(
        items=[EmergencyHotlineRead.model_validate(h) for h in items],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post("", response_model=EmergencyHotlineRead, status_code=status.HTTP_201_CREATED)
async def create_hotline(
    payload: EmergencyHotlineCreate,
    db: AsyncSession = Depends(get_db),
) -> EmergencyHotlineRead:
    created = await crud_hotline.create(db, obj_in=payload)
    return EmergencyHotlineRead.model_validate(created)


@router.get("/national", response_model=PaginatedResponse[EmergencyHotlineRead])
async def list_national_hotlines(
    db: AsyncSession = Depends(get_db),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=100, ge=1, le=200),
) -> PaginatedResponse[EmergencyHotlineRead]:
    filters = {"is_national": True, "is_active": True}
    total = await crud_hotline.count(db, filters=filters)
    items = await crud_hotline.list(
        db,
        skip=(page - 1) * page_size,
        limit=page_size,
        order_by="priority",
        filters=filters,
    )
    return PaginatedResponse[EmergencyHotlineRead].create(
        items=[EmergencyHotlineRead.model_validate(h) for h in items],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{hotline_id}", response_model=EmergencyHotlineRead)
async def get_hotline(
    hotline_id: int,
    db: AsyncSession = Depends(get_db),
) -> EmergencyHotlineRead:
    h = await crud_hotline.get(db, hotline_id)
    if h is None:
        raise HTTPException(status_code=404, detail="Hotline not found")
    return EmergencyHotlineRead.model_validate(h)


@router.patch("/{hotline_id}", response_model=EmergencyHotlineRead)
async def update_hotline(
    hotline_id: int,
    payload: EmergencyHotlineUpdate,
    db: AsyncSession = Depends(get_db),
) -> EmergencyHotlineRead:
    h = await crud_hotline.get(db, hotline_id)
    if h is None:
        raise HTTPException(status_code=404, detail="Hotline not found")
    updated = await crud_hotline.update(db, db_obj=h, obj_in=payload)
    return EmergencyHotlineRead.model_validate(updated)


@router.delete("/{hotline_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_hotline(
    hotline_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    h = await crud_hotline.get(db, hotline_id)
    if h is None:
        raise HTTPException(status_code=404, detail="Hotline not found")
    await crud_hotline.delete(db, id=hotline_id)