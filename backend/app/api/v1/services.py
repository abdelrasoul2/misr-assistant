"""Service API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import service as crud_service
from app.db.session import get_db
from app.models.enums import ServiceStatus
from app.schemas.common import PaginatedResponse
from app.schemas.service import ServiceCreate, ServiceRead, ServiceUpdate

router = APIRouter(prefix="/services", tags=["services"])


@router.get("", response_model=PaginatedResponse[ServiceRead])
async def list_services(
    db: AsyncSession = Depends(get_db),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, ge=1, le=500),
    category_id: int | None = Query(default=None),
    status_filter: ServiceStatus | None = Query(default=None, alias="status"),
    is_active: bool | None = Query(default=None),
) -> PaginatedResponse[ServiceRead]:
    filters: dict = {}
    if category_id is not None:
        filters["category_id"] = category_id
    if status_filter is not None:
        filters["status"] = status_filter
    if is_active is not None:
        filters["is_active"] = is_active

    total = await crud_service.count(db, filters=filters or None)
    items = await crud_service.list(
        db,
        skip=(page - 1) * page_size,
        limit=page_size,
        order_by="name",
        filters=filters or None,
    )
    return PaginatedResponse[ServiceRead].create(
        items=[ServiceRead.model_validate(s) for s in items],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post("", response_model=ServiceRead, status_code=status.HTTP_201_CREATED)
async def create_service(
    payload: ServiceCreate,
    db: AsyncSession = Depends(get_db),
) -> ServiceRead:
    existing = await crud_service.get_by_slug(db, payload.slug)
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Service with slug {payload.slug!r} already exists",
        )
    created = await crud_service.create(db, obj_in=payload)
    return ServiceRead.model_validate(created)


@router.get("/by-slug/{slug}/full", response_model=dict)
async def get_service_full(
    slug: str,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Get service with all nested resources."""
    from app.schemas.service import (
        FeeRead,
        LocationRead,
        RequirementRead,
        ServiceAliasRead,
        ServiceQuestionOptionRead,
        ServiceQuestionRead,
        StepRead,
    )

    service = await crud_service.get_with_relations(db, slug)
    if service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service {slug!r} not found",
        )

    return {
        "service": ServiceRead.model_validate(service).model_dump(),
        "requirements": [
            RequirementRead.model_validate(r).model_dump()
            for r in service.requirements
        ],
        "steps": [StepRead.model_validate(s).model_dump() for s in service.steps],
        "fees": [FeeRead.model_validate(f).model_dump() for f in service.fees],
        "locations": [
            LocationRead.model_validate(l).model_dump()
            for l in service.locations
        ],
        "aliases": [
            ServiceAliasRead.model_validate(a).model_dump() for a in service.aliases
        ],
        "questions": [
            {
                **ServiceQuestionRead.model_validate(q).model_dump(),
                "options": [
                    ServiceQuestionOptionRead.model_validate(o).model_dump()
                    for o in q.options
                ],
            }
            for q in service.questions
        ],
    }


@router.get("/by-slug/{slug}", response_model=ServiceRead)
async def get_service_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db),
) -> ServiceRead:
    s = await crud_service.get_by_slug(db, slug)
    if s is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service {slug!r} not found",
        )
    return ServiceRead.model_validate(s)


@router.get("/{service_id}", response_model=ServiceRead)
async def get_service(
    service_id: int,
    db: AsyncSession = Depends(get_db),
) -> ServiceRead:
    s = await crud_service.get(db, service_id)
    if s is None:
        raise HTTPException(status_code=404, detail="Service not found")
    return ServiceRead.model_validate(s)


@router.patch("/{service_id}", response_model=ServiceRead)
async def update_service(
    service_id: int,
    payload: ServiceUpdate,
    db: AsyncSession = Depends(get_db),
) -> ServiceRead:
    s = await crud_service.get(db, service_id)
    if s is None:
        raise HTTPException(status_code=404, detail="Service not found")
    updated = await crud_service.update(db, db_obj=s, obj_in=payload)
    return ServiceRead.model_validate(updated)


@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_service(
    service_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    s = await crud_service.get(db, service_id)
    if s is None:
        raise HTTPException(status_code=404, detail="Service not found")
    await crud_service.delete(db, id=service_id)