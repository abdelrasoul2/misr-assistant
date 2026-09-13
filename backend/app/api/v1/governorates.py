"""Governorate API endpoints (read-heavy)."""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import governorate as crud_gov
from app.db.session import get_db
from app.schemas.common import PaginatedResponse
from app.schemas.governorate import GovernorateCreate, GovernorateRead, GovernorateUpdate

router = APIRouter(prefix="/governorates", tags=["governorates"])


@router.get("", response_model=PaginatedResponse[GovernorateRead])
async def list_governorates(
    db: AsyncSession = Depends(get_db),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, ge=1, le=100),
    region: str | None = Query(default=None),
) -> PaginatedResponse[GovernorateRead]:
    filters = {"region": region} if region else None
    total = await crud_gov.count(db, filters=filters)
    items = await crud_gov.list(
        db,
        skip=(page - 1) * page_size,
        limit=page_size,
        order_by="id",
        filters=filters,
    )
    return PaginatedResponse[GovernorateRead].create(
        items=[GovernorateRead.model_validate(g) for g in items],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post("", response_model=GovernorateRead, status_code=status.HTTP_201_CREATED)
async def create_governorate(
    payload: GovernorateCreate,
    db: AsyncSession = Depends(get_db),
) -> GovernorateRead:
    existing = await crud_gov.get_by_field(db, "code", payload.code)
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Governorate with code {payload.code!r} already exists",
        )
    created = await crud_gov.create(db, obj_in=payload)
    return GovernorateRead.model_validate(created)


@router.get("/by-code/{code}", response_model=GovernorateRead)
async def get_governorate_by_code(
    code: str,
    db: AsyncSession = Depends(get_db),
) -> GovernorateRead:
    g = await crud_gov.get_by_field(db, "code", code.upper())
    if g is None:
        raise HTTPException(status_code=404, detail=f"Governorate {code!r} not found")
    return GovernorateRead.model_validate(g)


@router.get("/{governorate_id}", response_model=GovernorateRead)
async def get_governorate(
    governorate_id: int,
    db: AsyncSession = Depends(get_db),
) -> GovernorateRead:
    g = await crud_gov.get(db, governorate_id)
    if g is None:
        raise HTTPException(status_code=404, detail="Governorate not found")
    return GovernorateRead.model_validate(g)


@router.patch("/{governorate_id}", response_model=GovernorateRead)
async def update_governorate(
    governorate_id: int,
    payload: GovernorateUpdate,
    db: AsyncSession = Depends(get_db),
) -> GovernorateRead:
    g = await crud_gov.get(db, governorate_id)
    if g is None:
        raise HTTPException(status_code=404, detail="Governorate not found")
    updated = await crud_gov.update(db, db_obj=g, obj_in=payload)
    return GovernorateRead.model_validate(updated)


@router.delete("/{governorate_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_governorate(
    governorate_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    g = await crud_gov.get(db, governorate_id)
    if g is None:
        raise HTTPException(status_code=404, detail="Governorate not found")
    await crud_gov.delete(db, id=governorate_id)