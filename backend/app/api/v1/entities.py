"""GovernmentEntity API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import government_entity as crud_entity
from app.db.session import get_db
from app.models.enums import EntityType
from app.schemas.common import PaginatedResponse
from app.schemas.government_entity import (
    GovernmentEntityCreate,
    GovernmentEntityRead,
    GovernmentEntityUpdate,
)

router = APIRouter(prefix="/entities", tags=["entities"])


@router.get("", response_model=PaginatedResponse[GovernmentEntityRead])
async def list_entities(
    db: AsyncSession = Depends(get_db),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, ge=1, le=100),
    sector_id: int | None = Query(default=None),
    governorate_id: int | None = Query(default=None),
    entity_type: EntityType | None = Query(default=None),
    is_active: bool | None = Query(default=None),
) -> PaginatedResponse[GovernmentEntityRead]:
    filters: dict = {}
    if sector_id is not None:
        filters["sector_id"] = sector_id
    if governorate_id is not None:
        filters["governorate_id"] = governorate_id
    if entity_type is not None:
        filters["entity_type"] = entity_type
    if is_active is not None:
        filters["is_active"] = is_active

    total = await crud_entity.count(db, filters=filters or None)
    items = await crud_entity.list(
        db,
        skip=(page - 1) * page_size,
        limit=page_size,
        order_by="id",
        filters=filters or None,
    )
    return PaginatedResponse[GovernmentEntityRead].create(
        items=[GovernmentEntityRead.model_validate(e) for e in items],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post("", response_model=GovernmentEntityRead, status_code=status.HTTP_201_CREATED)
async def create_entity(
    payload: GovernmentEntityCreate,
    db: AsyncSession = Depends(get_db),
) -> GovernmentEntityRead:
    existing = await crud_entity.get_by_field(db, "slug", payload.slug)
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Entity with slug {payload.slug!r} already exists",
        )
    created = await crud_entity.create(db, obj_in=payload)
    return GovernmentEntityRead.model_validate(created)


@router.get("/by-slug/{slug}", response_model=GovernmentEntityRead)
async def get_entity_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db),
) -> GovernmentEntityRead:
    e = await crud_entity.get_by_field(db, "slug", slug)
    if e is None:
        raise HTTPException(status_code=404, detail=f"Entity {slug!r} not found")
    return GovernmentEntityRead.model_validate(e)


@router.get("/{entity_id}", response_model=GovernmentEntityRead)
async def get_entity(
    entity_id: int,
    db: AsyncSession = Depends(get_db),
) -> GovernmentEntityRead:
    e = await crud_entity.get(db, entity_id)
    if e is None:
        raise HTTPException(status_code=404, detail="Entity not found")
    return GovernmentEntityRead.model_validate(e)


@router.patch("/{entity_id}", response_model=GovernmentEntityRead)
async def update_entity(
    entity_id: int,
    payload: GovernmentEntityUpdate,
    db: AsyncSession = Depends(get_db),
) -> GovernmentEntityRead:
    e = await crud_entity.get(db, entity_id)
    if e is None:
        raise HTTPException(status_code=404, detail="Entity not found")
    updated = await crud_entity.update(db, db_obj=e, obj_in=payload)
    return GovernmentEntityRead.model_validate(updated)


@router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_entity(
    entity_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    e = await crud_entity.get(db, entity_id)
    if e is None:
        raise HTTPException(status_code=404, detail="Entity not found")
    await crud_entity.delete(db, id=entity_id)