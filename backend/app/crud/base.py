"""Generic async CRUD base class."""
from typing import Any, Generic, TypeVar

from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.base import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    """Generic CRUD operations for a SQLAlchemy model."""

    def __init__(self, model: type[ModelType]) -> None:
        self.model = model

    async def get(self, db: AsyncSession, id: int) -> ModelType | None:
        """Get a single record by primary key."""
        result = await db.execute(select(self.model).where(self.model.id == id))
        return result.scalar_one_or_none()

    async def get_by_field(
        self, db: AsyncSession, field: str, value: Any
    ) -> ModelType | None:
        """Get a single record by an arbitrary field."""
        column = getattr(self.model, field, None)
        if column is None:
            raise ValueError(f"Model {self.model.__name__} has no field {field!r}")
        result = await db.execute(select(self.model).where(column == value))
        return result.scalar_one_or_none()

    async def list(
        self,
        db: AsyncSession,
        *,
        skip: int = 0,
        limit: int = 100,
        order_by: str | None = None,
        filters: dict[str, Any] | None = None,
    ) -> list[ModelType]:
        """List records with optional filters, ordering, and pagination."""
        stmt = select(self.model)

        if filters:
            for field, value in filters.items():
                column = getattr(self.model, field, None)
                if column is not None and value is not None:
                    stmt = stmt.where(column == value)

        if order_by:
            column = getattr(self.model, order_by, None)
            if column is not None:
                stmt = stmt.order_by(column)

        stmt = stmt.offset(skip).limit(limit)
        result = await db.execute(stmt)
        return list(result.scalars().all())

    async def count(
        self, db: AsyncSession, *, filters: dict[str, Any] | None = None
    ) -> int:
        """Count records matching optional filters."""
        stmt = select(func.count()).select_from(self.model)

        if filters:
            for field, value in filters.items():
                column = getattr(self.model, field, None)
                if column is not None and value is not None:
                    stmt = stmt.where(column == value)

        result = await db.execute(stmt)
        return int(result.scalar_one())

    async def create(
        self, db: AsyncSession, *, obj_in: CreateSchemaType | dict[str, Any]
    ) -> ModelType:
        """Create a new record."""
        data = obj_in if isinstance(obj_in, dict) else obj_in.model_dump(exclude_unset=False)
        db_obj = self.model(**data)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(
        self,
        db: AsyncSession,
        *,
        db_obj: ModelType,
        obj_in: UpdateSchemaType | dict[str, Any],
    ) -> ModelType:
        """Update an existing record."""
        data = (
            obj_in
            if isinstance(obj_in, dict)
            else obj_in.model_dump(exclude_unset=True)
        )
        for field, value in data.items():
            if hasattr(db_obj, field):
                setattr(db_obj, field, value)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def delete(self, db: AsyncSession, *, id: int) -> ModelType | None:
        """Delete a record by ID."""
        db_obj = await self.get(db, id)
        if db_obj is None:
            return None
        await db.delete(db_obj)
        await db.commit()
        return db_obj