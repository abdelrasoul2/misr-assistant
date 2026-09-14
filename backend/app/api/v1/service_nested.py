"""Nested API endpoints for Service resources."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import service as crud
from app.db.session import get_db
from app.models.fee import Fee
from app.models.location import Location
from app.models.requirement import Requirement
from app.models.service_alias import ServiceAlias
from app.models.service_question import ServiceQuestion
from app.models.service_question_option import ServiceQuestionOption
from app.models.step import Step
from app.schemas.service import (
    FeeCreate,
    FeeRead,
    FeeUpdate,
    LocationCreate,
    LocationRead,
    LocationUpdate,
    RequirementCreate,
    RequirementRead,
    RequirementUpdate,
    ServiceAliasCreate,
    ServiceAliasRead,
    ServiceQuestionCreate,
    ServiceQuestionOptionCreate,
    ServiceQuestionOptionRead,
    ServiceQuestionRead,
    ServiceQuestionUpdate,
    StepCreate,
    StepRead,
    StepUpdate,
)

router = APIRouter(prefix="/services", tags=["service-nested"])


# ============ REQUIREMENTS ============
@router.get(
    "/{service_id}/requirements",
    response_model=list[RequirementRead],
)
async def list_requirements(
    service_id: int, db: AsyncSession = Depends(get_db)
) -> list[RequirementRead]:
    result = await db.execute(
        select(Requirement)
        .where(Requirement.service_id == service_id)
        .order_by(Requirement.sort_order)
    )
    return [RequirementRead.model_validate(r) for r in result.scalars().all()]


@router.post(
    "/{service_id}/requirements",
    response_model=RequirementRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_requirement(
    service_id: int,
    payload: RequirementCreate,
    db: AsyncSession = Depends(get_db),
) -> RequirementRead:
    if payload.service_id != service_id:
        raise HTTPException(status_code=400, detail="service_id mismatch")
    created = await crud.requirement.create(db, obj_in=payload)
    return RequirementRead.model_validate(created)


@router.patch(
    "/{service_id}/requirements/{req_id}",
    response_model=RequirementRead,
)
async def update_requirement(
    service_id: int,
    req_id: int,
    payload: RequirementUpdate,
    db: AsyncSession = Depends(get_db),
) -> RequirementRead:
    obj = await crud.requirement.get(db, req_id)
    if obj is None or obj.service_id != service_id:
        raise HTTPException(status_code=404, detail="Requirement not found")
    updated = await crud.requirement.update(db, db_obj=obj, obj_in=payload)
    return RequirementRead.model_validate(updated)


@router.delete(
    "/{service_id}/requirements/{req_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_requirement(
    service_id: int, req_id: int, db: AsyncSession = Depends(get_db)
) -> None:
    obj = await crud.requirement.get(db, req_id)
    if obj is None or obj.service_id != service_id:
        raise HTTPException(status_code=404, detail="Requirement not found")
    await crud.requirement.delete(db, id=req_id)


# ============ STEPS ============
@router.get("/{service_id}/steps", response_model=list[StepRead])
async def list_steps(
    service_id: int, db: AsyncSession = Depends(get_db)
) -> list[StepRead]:
    result = await db.execute(
        select(Step)
        .where(Step.service_id == service_id)
        .order_by(Step.step_number)
    )
    return [StepRead.model_validate(s) for s in result.scalars().all()]


@router.post(
    "/{service_id}/steps",
    response_model=StepRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_step(
    service_id: int,
    payload: StepCreate,
    db: AsyncSession = Depends(get_db),
) -> StepRead:
    if payload.service_id != service_id:
        raise HTTPException(status_code=400, detail="service_id mismatch")
    created = await crud.step.create(db, obj_in=payload)
    return StepRead.model_validate(created)


@router.patch("/{service_id}/steps/{step_id}", response_model=StepRead)
async def update_step(
    service_id: int,
    step_id: int,
    payload: StepUpdate,
    db: AsyncSession = Depends(get_db),
) -> StepRead:
    obj = await crud.step.get(db, step_id)
    if obj is None or obj.service_id != service_id:
        raise HTTPException(status_code=404, detail="Step not found")
    updated = await crud.step.update(db, db_obj=obj, obj_in=payload)
    return StepRead.model_validate(updated)


@router.delete(
    "/{service_id}/steps/{step_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_step(
    service_id: int, step_id: int, db: AsyncSession = Depends(get_db)
) -> None:
    obj = await crud.step.get(db, step_id)
    if obj is None or obj.service_id != service_id:
        raise HTTPException(status_code=404, detail="Step not found")
    await crud.step.delete(db, id=step_id)


# ============ FEES ============
@router.get("/{service_id}/fees", response_model=list[FeeRead])
async def list_fees(
    service_id: int, db: AsyncSession = Depends(get_db)
) -> list[FeeRead]:
    result = await db.execute(
        select(Fee).where(Fee.service_id == service_id).order_by(Fee.id)
    )
    return [FeeRead.model_validate(f) for f in result.scalars().all()]


@router.post(
    "/{service_id}/fees",
    response_model=FeeRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_fee(
    service_id: int,
    payload: FeeCreate,
    db: AsyncSession = Depends(get_db),
) -> FeeRead:
    if payload.service_id != service_id:
        raise HTTPException(status_code=400, detail="service_id mismatch")
    created = await crud.fee.create(db, obj_in=payload)
    return FeeRead.model_validate(created)


@router.patch("/{service_id}/fees/{fee_id}", response_model=FeeRead)
async def update_fee(
    service_id: int,
    fee_id: int,
    payload: FeeUpdate,
    db: AsyncSession = Depends(get_db),
) -> FeeRead:
    obj = await crud.fee.get(db, fee_id)
    if obj is None or obj.service_id != service_id:
        raise HTTPException(status_code=404, detail="Fee not found")
    updated = await crud.fee.update(db, db_obj=obj, obj_in=payload)
    return FeeRead.model_validate(updated)


@router.delete(
    "/{service_id}/fees/{fee_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_fee(
    service_id: int, fee_id: int, db: AsyncSession = Depends(get_db)
) -> None:
    obj = await crud.fee.get(db, fee_id)
    if obj is None or obj.service_id != service_id:
        raise HTTPException(status_code=404, detail="Fee not found")
    await crud.fee.delete(db, id=fee_id)


# ============ LOCATIONS ============
@router.get("/{service_id}/locations", response_model=list[LocationRead])
async def list_locations(
    service_id: int, db: AsyncSession = Depends(get_db)
) -> list[LocationRead]:
    result = await db.execute(
        select(Location).where(Location.service_id == service_id)
    )
    return [LocationRead.model_validate(l) for l in result.scalars().all()]


@router.post(
    "/{service_id}/locations",
    response_model=LocationRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_location(
    service_id: int,
    payload: LocationCreate,
    db: AsyncSession = Depends(get_db),
) -> LocationRead:
    if payload.service_id != service_id:
        raise HTTPException(status_code=400, detail="service_id mismatch")
    created = await crud.location.create(db, obj_in=payload)
    return LocationRead.model_validate(created)


@router.patch(
    "/{service_id}/locations/{loc_id}", response_model=LocationRead
)
async def update_location(
    service_id: int,
    loc_id: int,
    payload: LocationUpdate,
    db: AsyncSession = Depends(get_db),
) -> LocationRead:
    obj = await crud.location.get(db, loc_id)
    if obj is None or obj.service_id != service_id:
        raise HTTPException(status_code=404, detail="Location not found")
    updated = await crud.location.update(db, db_obj=obj, obj_in=payload)
    return LocationRead.model_validate(updated)


@router.delete(
    "/{service_id}/locations/{loc_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_location(
    service_id: int, loc_id: int, db: AsyncSession = Depends(get_db)
) -> None:
    obj = await crud.location.get(db, loc_id)
    if obj is None or obj.service_id != service_id:
        raise HTTPException(status_code=404, detail="Location not found")
    await crud.location.delete(db, id=loc_id)


# ============ ALIASES ============
@router.get(
    "/{service_id}/aliases", response_model=list[ServiceAliasRead]
)
async def list_aliases(
    service_id: int, db: AsyncSession = Depends(get_db)
) -> list[ServiceAliasRead]:
    result = await db.execute(
        select(ServiceAlias).where(ServiceAlias.service_id == service_id)
    )
    return [ServiceAliasRead.model_validate(a) for a in result.scalars().all()]


@router.post(
    "/{service_id}/aliases",
    response_model=ServiceAliasRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_alias(
    service_id: int,
    payload: ServiceAliasCreate,
    db: AsyncSession = Depends(get_db),
) -> ServiceAliasRead:
    if payload.service_id != service_id:
        raise HTTPException(status_code=400, detail="service_id mismatch")
    created = await crud.service_alias.create(db, obj_in=payload)
    return ServiceAliasRead.model_validate(created)


@router.delete(
    "/{service_id}/aliases/{alias_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_alias(
    service_id: int, alias_id: int, db: AsyncSession = Depends(get_db)
) -> None:
    obj = await crud.service_alias.get(db, alias_id)
    if obj is None or obj.service_id != service_id:
        raise HTTPException(status_code=404, detail="Alias not found")
    await crud.service_alias.delete(db, id=alias_id)


# ============ QUESTIONS + OPTIONS ============
@router.get(
    "/{service_id}/questions", response_model=list[ServiceQuestionRead]
)
async def list_questions(
    service_id: int, db: AsyncSession = Depends(get_db)
) -> list[ServiceQuestionRead]:
    result = await db.execute(
        select(ServiceQuestion)
        .where(ServiceQuestion.service_id == service_id)
        .order_by(ServiceQuestion.sort_order)
    )
    return [ServiceQuestionRead.model_validate(q) for q in result.scalars().all()]


@router.post(
    "/{service_id}/questions",
    response_model=ServiceQuestionRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_question(
    service_id: int,
    payload: ServiceQuestionCreate,
    db: AsyncSession = Depends(get_db),
) -> ServiceQuestionRead:
    if payload.service_id != service_id:
        raise HTTPException(status_code=400, detail="service_id mismatch")
    created = await crud.service_question.create(db, obj_in=payload)
    return ServiceQuestionRead.model_validate(created)


@router.patch(
    "/{service_id}/questions/{q_id}", response_model=ServiceQuestionRead
)
async def update_question(
    service_id: int,
    q_id: int,
    payload: ServiceQuestionUpdate,
    db: AsyncSession = Depends(get_db),
) -> ServiceQuestionRead:
    obj = await crud.service_question.get(db, q_id)
    if obj is None or obj.service_id != service_id:
        raise HTTPException(status_code=404, detail="Question not found")
    updated = await crud.service_question.update(db, db_obj=obj, obj_in=payload)
    return ServiceQuestionRead.model_validate(updated)


@router.delete(
    "/{service_id}/questions/{q_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_question(
    service_id: int, q_id: int, db: AsyncSession = Depends(get_db)
) -> None:
    obj = await crud.service_question.get(db, q_id)
    if obj is None or obj.service_id != service_id:
        raise HTTPException(status_code=404, detail="Question not found")
    await crud.service_question.delete(db, id=q_id)


# === Question Options ===
@router.get(
    "/{service_id}/questions/{q_id}/options",
    response_model=list[ServiceQuestionOptionRead],
)
async def list_question_options(
    service_id: int, q_id: int, db: AsyncSession = Depends(get_db)
) -> list[ServiceQuestionOptionRead]:
    result = await db.execute(
        select(ServiceQuestionOption)
        .where(ServiceQuestionOption.question_id == q_id)
        .order_by(ServiceQuestionOption.sort_order)
    )
    return [
        ServiceQuestionOptionRead.model_validate(o)
        for o in result.scalars().all()
    ]


@router.post(
    "/{service_id}/questions/{q_id}/options",
    response_model=ServiceQuestionOptionRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_question_option(
    service_id: int,
    q_id: int,
    payload: ServiceQuestionOptionCreate,
    db: AsyncSession = Depends(get_db),
) -> ServiceQuestionOptionRead:
    if payload.question_id != q_id:
        raise HTTPException(status_code=400, detail="question_id mismatch")
    created = await crud.service_question_option.create(db, obj_in=payload)
    return ServiceQuestionOptionRead.model_validate(created)


@router.delete(
    "/{service_id}/questions/{q_id}/options/{opt_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_question_option(
    service_id: int,
    q_id: int,
    opt_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    obj = await crud.service_question_option.get(db, opt_id)
    if obj is None or obj.question_id != q_id:
        raise HTTPException(status_code=404, detail="Option not found")
    await crud.service_question_option.delete(db, id=opt_id)