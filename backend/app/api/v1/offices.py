"""GovernmentOffice API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import government_office as crud_office
from app.db.session import get_db
from app.models.enums import OfficeType
from app.schemas.common import PaginatedResponse
from app.schemas.government_office import (
    GovernmentOfficeCreate,
    GovernmentOfficeRead,
    GovernmentOfficeUpdate,
)

router = APIRouter(prefix="/offices", tags=["offices"])


@router.get("", response_model=PaginatedResponse[GovernmentOfficeRead])
async def list_offices(
    db: AsyncSession = Depends(get_db),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, ge=1, le=1000),
    governorate_id: int | None = Query(default=None),
    office_type: OfficeType | None = Query(default=None),
    entity_id: int | None = Query(default=None),
    is_emergency: bool | None = Query(default=None),
    is_active: bool | None = Query(default=True),
) -> PaginatedResponse[GovernmentOfficeRead]:
    filters: dict = {}
    if governorate_id is not None:
        filters["governorate_id"] = governorate_id
    if office_type is not None:
        filters["office_type"] = office_type
    if entity_id is not None:
        filters["entity_id"] = entity_id
    if is_emergency is not None:
        filters["is_emergency"] = is_emergency
    if is_active is not None:
        filters["is_active"] = is_active

    total = await crud_office.count(db, filters=filters or None)
    items = await crud_office.list(
        db,
        skip=(page - 1) * page_size,
        limit=page_size,
        order_by="id",
        filters=filters or None,
    )
    return PaginatedResponse[GovernmentOfficeRead].create(
        items=[GovernmentOfficeRead.model_validate(o) for o in items],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post("", response_model=GovernmentOfficeRead, status_code=status.HTTP_201_CREATED)
async def create_office(
    payload: GovernmentOfficeCreate,
    db: AsyncSession = Depends(get_db),
) -> GovernmentOfficeRead:
    existing = await crud_office.get_by_field(db, "slug", payload.slug)
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Office with slug {payload.slug!r} already exists",
        )
    created = await crud_office.create(db, obj_in=payload)
    return GovernmentOfficeRead.model_validate(created)


@router.get("/by-slug/{slug}", response_model=GovernmentOfficeRead)
async def get_office_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db),
) -> GovernmentOfficeRead:
    o = await crud_office.get_by_field(db, "slug", slug)
    if o is None:
        raise HTTPException(status_code=404, detail=f"Office {slug!r} not found")
    return GovernmentOfficeRead.model_validate(o)


@router.get("/{office_id}", response_model=GovernmentOfficeRead)
async def get_office(
    office_id: int,
    db: AsyncSession = Depends(get_db),
) -> GovernmentOfficeRead:
    o = await crud_office.get(db, office_id)
    if o is None:
        raise HTTPException(status_code=404, detail="Office not found")
    return GovernmentOfficeRead.model_validate(o)


@router.patch("/{office_id}", response_model=GovernmentOfficeRead)
async def update_office(
    office_id: int,
    payload: GovernmentOfficeUpdate,
    db: AsyncSession = Depends(get_db),
) -> GovernmentOfficeRead:
    o = await crud_office.get(db, office_id)
    if o is None:
        raise HTTPException(status_code=404, detail="Office not found")
    updated = await crud_office.update(db, db_obj=o, obj_in=payload)
    return GovernmentOfficeRead.model_validate(updated)


@router.delete("/{office_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_office(
    office_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    o = await crud_office.get(db, office_id)
    if o is None:
        raise HTTPException(status_code=404, detail="Office not found")
    await crud_office.delete(db, id=office_id)