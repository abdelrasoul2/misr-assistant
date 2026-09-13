"""Source API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import source as crud_source
from app.db.session import get_db
from app.schemas.common import PaginatedResponse
from app.schemas.source import SourceCreate, SourceRead, SourceUpdate, SourceVerify

router = APIRouter(prefix="/sources", tags=["sources"])


@router.get("", response_model=PaginatedResponse[SourceRead])
async def list_sources(
    db: AsyncSession = Depends(get_db),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    official: bool | None = Query(default=None),
) -> PaginatedResponse[SourceRead]:
    """List sources with pagination and optional official filter."""
    filters = {"official": official} if official is not None else None
    total = await crud_source.count(db, filters=filters)
    items = await crud_source.list(
        db,
        skip=(page - 1) * page_size,
        limit=page_size,
        order_by="id",
        filters=filters,
    )
    return PaginatedResponse[SourceRead].create(
        items=[SourceRead.model_validate(s) for s in items],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post("", response_model=SourceRead, status_code=status.HTTP_201_CREATED)
async def create_source(
    payload: SourceCreate,
    db: AsyncSession = Depends(get_db),
) -> SourceRead:
    """Create a new source."""
    created = await crud_source.create(db, obj_in=payload)
    return SourceRead.model_validate(created)


@router.get("/{source_id}", response_model=SourceRead)
async def get_source(
    source_id: int,
    db: AsyncSession = Depends(get_db),
) -> SourceRead:
    """Get a source by ID."""
    src = await crud_source.get(db, source_id)
    if src is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Source with id {source_id} not found",
        )
    return SourceRead.model_validate(src)


@router.patch("/{source_id}", response_model=SourceRead)
async def update_source(
    source_id: int,
    payload: SourceUpdate,
    db: AsyncSession = Depends(get_db),
) -> SourceRead:
    """Update a source (partial)."""
    src = await crud_source.get(db, source_id)
    if src is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Source with id {source_id} not found",
        )
    updated = await crud_source.update(db, db_obj=src, obj_in=payload)
    return SourceRead.model_validate(updated)


@router.post("/{source_id}/verify", response_model=SourceRead)
async def verify_source(
    source_id: int,
    payload: SourceVerify,
    db: AsyncSession = Depends(get_db),
) -> SourceRead:
    """Mark a source as verified now by a specific person."""
    src = await crud_source.get(db, source_id)
    if src is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Source with id {source_id} not found",
        )
    updated = await crud_source.mark_verified(
        db, db_obj=src, checked_by=payload.checked_by
    )
    return SourceRead.model_validate(updated)


@router.delete("/{source_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_source(
    source_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a source."""
    src = await crud_source.get(db, source_id)
    if src is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Source with id {source_id} not found",
        )
    await crud_source.delete(db, id=source_id)