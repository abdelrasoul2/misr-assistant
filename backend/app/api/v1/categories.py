"""Category API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import category as crud_category
from app.db.session import get_db
from app.schemas.category import CategoryCreate, CategoryRead, CategoryUpdate
from app.schemas.common import PaginatedResponse

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=PaginatedResponse[CategoryRead])
async def list_categories(
    db: AsyncSession = Depends(get_db),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    is_active: bool | None = Query(default=None),
) -> PaginatedResponse[CategoryRead]:
    """List categories with pagination."""
    filters = {"is_active": is_active} if is_active is not None else None
    total = await crud_category.count(db, filters=filters)
    items = await crud_category.list(
        db,
        skip=(page - 1) * page_size,
        limit=page_size,
        order_by="sort_order",
        filters=filters,
    )
    return PaginatedResponse[CategoryRead].create(
        items=[CategoryRead.model_validate(c) for c in items],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post("", response_model=CategoryRead, status_code=status.HTTP_201_CREATED)
async def create_category(
    payload: CategoryCreate,
    db: AsyncSession = Depends(get_db),
) -> CategoryRead:
    """Create a new category."""
    existing = await crud_category.get_by_slug(db, payload.slug)
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Category with slug {payload.slug!r} already exists",
        )
    created = await crud_category.create(db, obj_in=payload)
    return CategoryRead.model_validate(created)


@router.get("/slug/{slug}", response_model=CategoryRead)
async def get_category_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db),
) -> CategoryRead:
    """Get a category by its slug."""
    cat = await crud_category.get_by_slug(db, slug)
    if cat is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with slug {slug!r} not found",
        )
    return CategoryRead.model_validate(cat)


@router.get("/{category_id}", response_model=CategoryRead)
async def get_category(
    category_id: int,
    db: AsyncSession = Depends(get_db),
) -> CategoryRead:
    """Get a category by ID."""
    cat = await crud_category.get(db, category_id)
    if cat is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id {category_id} not found",
        )
    return CategoryRead.model_validate(cat)


@router.patch("/{category_id}", response_model=CategoryRead)
async def update_category(
    category_id: int,
    payload: CategoryUpdate,
    db: AsyncSession = Depends(get_db),
) -> CategoryRead:
    """Update a category (partial)."""
    cat = await crud_category.get(db, category_id)
    if cat is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id {category_id} not found",
        )

    if payload.slug is not None and payload.slug != cat.slug:
        existing = await crud_category.get_by_slug(db, payload.slug)
        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Category with slug {payload.slug!r} already exists",
            )

    updated = await crud_category.update(db, db_obj=cat, obj_in=payload)
    return CategoryRead.model_validate(updated)


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a category."""
    cat = await crud_category.get(db, category_id)
    if cat is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id {category_id} not found",
        )
    await crud_category.delete(db, id=category_id)