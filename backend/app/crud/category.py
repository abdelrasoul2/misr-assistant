"""CRUD operations for Category."""
from app.crud.base import CRUDBase
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate


class CRUDCategory(CRUDBase[Category, CategoryCreate, CategoryUpdate]):
    """Category-specific CRUD operations."""

    async def get_by_slug(self, db, slug: str) -> Category | None:
        """Get a category by its unique slug."""
        return await self.get_by_field(db, "slug", slug)


category = CRUDCategory(Category)