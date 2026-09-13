"""Sector API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import sector as crud_sector
from app.db.session import get_db
from app.schemas.common import PaginatedResponse
from app.schemas.sector import SectorCreate, SectorRead, SectorUpdate

router = APIRouter(prefix="/sectors", tags=["sectors"])


@router.get("", response_model=PaginatedResponse[SectorRead])
async def list_sectors(
    db: AsyncSession = Depends(get_db),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, ge=1, le=100),
    is_active: bool | None = Query(default=None),
) -> PaginatedResponse[SectorRead]:
    filters = {"is_active": is_active} if is_active is not None else None
    total = await crud_sector.count(db, filters=filters)
    items = await crud_sector.list(
        db,
        skip=(page - 1) * page_size,
        limit=page_size,
        order_by="sort_order",
        filters=filters,
    )
    return PaginatedResponse[SectorRead].create(
        items=[SectorRead.model_validate(s) for s in items],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post("", response_model=SectorRead, status_code=status.HTTP_201_CREATED)
async def create_sector(
    payload: SectorCreate,
    db: AsyncSession = Depends(get_db),
) -> SectorRead:
    existing = await crud_sector.get_by_field(db, "slug", payload.slug)
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Sector with slug {payload.slug!r} already exists",
        )
    created = await crud_sector.create(db, obj_in=payload)
    return SectorRead.model_validate(created)


@router.get("/{sector_id}", response_model=SectorRead)
async def get_sector(
    sector_id: int,
    db: AsyncSession = Depends(get_db),
) -> SectorRead:
    s = await crud_sector.get(db, sector_id)
    if s is None:
        raise HTTPException(status_code=404, detail="Sector not found")
    return SectorRead.model_validate(s)


@router.patch("/{sector_id}", response_model=SectorRead)
async def update_sector(
    sector_id: int,
    payload: SectorUpdate,
    db: AsyncSession = Depends(get_db),
) -> SectorRead:
    s = await crud_sector.get(db, sector_id)
    if s is None:
        raise HTTPException(status_code=404, detail="Sector not found")
    updated = await crud_sector.update(db, db_obj=s, obj_in=payload)
    return SectorRead.model_validate(updated)


@router.delete("/{sector_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_sector(
    sector_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    s = await crud_sector.get(db, sector_id)
    if s is None:
        raise HTTPException(status_code=404, detail="Sector not found")
    await crud_sector.delete(db, id=sector_id)