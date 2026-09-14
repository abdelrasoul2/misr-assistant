"""CRUD for Service and nested resources."""
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import CRUDBase
from app.models.fee import Fee
from app.models.location import Location
from app.models.requirement import Requirement
from app.models.service import Service
from app.models.service_alias import ServiceAlias
from app.models.service_question import ServiceQuestion
from app.models.service_question_option import ServiceQuestionOption
from app.models.step import Step
from app.schemas.service import (
    FeeCreate,
    FeeUpdate,
    LocationCreate,
    LocationUpdate,
    RequirementCreate,
    RequirementUpdate,
    ServiceAliasCreate,
    ServiceCreate,
    ServiceQuestionCreate,
    ServiceQuestionOptionCreate,
    ServiceQuestionUpdate,
    ServiceUpdate,
    StepCreate,
    StepUpdate,
)


class CRUDService(CRUDBase[Service, ServiceCreate, ServiceUpdate]):
    async def get_by_slug(self, db: AsyncSession, slug: str) -> Service | None:
        result = await db.execute(select(Service).where(Service.slug == slug))
        return result.scalar_one_or_none()

    async def get_with_relations(
        self, db: AsyncSession, slug: str
    ) -> Service | None:
        from sqlalchemy.orm import selectinload

        stmt = (
            select(Service)
            .where(Service.slug == slug)
            .options(
                selectinload(Service.requirements),
                selectinload(Service.steps),
                selectinload(Service.fees),
                selectinload(Service.locations),
                selectinload(Service.aliases),
                selectinload(Service.questions).selectinload(
                    ServiceQuestion.options
                ),
            )
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def search_by_alias(
        self, db: AsyncSession, query: str, limit: int = 10
    ) -> list[tuple[Service, int]]:
        normalized = query.lower().strip()
        stmt = (
            select(Service, ServiceAlias.weight)
            .join(ServiceAlias, ServiceAlias.service_id == Service.id)
            .where(
                ServiceAlias.normalized.like(f"%{normalized}%"),
                Service.is_active == True,  # noqa
            )
            .order_by(ServiceAlias.weight.desc())
            .limit(limit)
        )
        result = await db.execute(stmt)
        return [(row[0], row[1]) for row in result.all()]


class CRUDRequirement(CRUDBase[Requirement, RequirementCreate, RequirementUpdate]):
    pass


class CRUDStep(CRUDBase[Step, StepCreate, StepUpdate]):
    pass


class CRUDFee(CRUDBase[Fee, FeeCreate, FeeUpdate]):
    pass


class CRUDLocation(CRUDBase[Location, LocationCreate, LocationUpdate]):
    pass


class CRUDServiceAlias(
    CRUDBase[ServiceAlias, ServiceAliasCreate, ServiceAliasCreate]
):
    pass


class CRUDServiceQuestion(
    CRUDBase[ServiceQuestion, ServiceQuestionCreate, ServiceQuestionUpdate]
):
    pass


class CRUDServiceQuestionOption(
    CRUDBase[
        ServiceQuestionOption,
        ServiceQuestionOptionCreate,
        ServiceQuestionOptionCreate,
    ]
):
    pass


service = CRUDService(Service)
requirement = CRUDRequirement(Requirement)
step = CRUDStep(Step)
fee = CRUDFee(Fee)
location = CRUDLocation(Location)
service_alias = CRUDServiceAlias(ServiceAlias)
service_question = CRUDServiceQuestion(ServiceQuestion)
service_question_option = CRUDServiceQuestionOption(ServiceQuestionOption)