"""AI Assistant chat endpoint."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.assistant_context import (
    ASSISTANT_SYSTEM_INSTRUCTION,
    build_context_for_intent,
    classify_intent,
    truncate_context,
)
from app.core.gemini import GeminiError, gemini
from app.core.text_normalizer import normalize_arabic
from app.db.session import get_db
from app.models.service import Service
from app.models.source import Source
from app.schemas.assistant import (
    AssistantRequest,
    AssistantResponse,
    AssistantSource,
    SuggestedService,
)

router = APIRouter(prefix="/assistant", tags=["assistant"])


async def _find_suggested_services(
    db: AsyncSession,
    reply: str,
    user_message: str,
) -> list[SuggestedService]:
    """Find services mentioned in the AI reply."""
    result = await db.execute(
        select(Service).where(Service.is_active == True)  # noqa: E712
    )
    services = result.scalars().all()

    reply_norm = normalize_arabic(reply)
    user_norm = normalize_arabic(user_message)
    combined = reply_norm + " " + user_norm

    stopwords = {
        "في", "من", "على", "الى", "عن", "مع", "هو", "هي",
        "التي", "الذي", "هذا", "هذه", "ذلك", "كل", "بعض",
        "او", "أو", "و", "لا", "ما", "ان", "أن", "إن",
    }

    scored: list[tuple[int, Service]] = []

    for svc in services:
        svc_name_norm = normalize_arabic(svc.name)
        words = [
            w for w in svc_name_norm.split()
            if len(w) >= 3 and w not in stopwords
        ]

        score = 0
        if svc_name_norm in combined:
            score += 100
        matches = sum(1 for w in words if w in combined)
        score += matches * 10
        if words and matches / len(words) >= 0.5:
            score += 20

        if score > 0:
            scored.append((score, svc))

    scored.sort(key=lambda x: x[0], reverse=True)

    return [
        SuggestedService(
            id=svc.id,
            name=svc.name,
            slug=svc.slug,
            description=svc.description,
            category_id=svc.category_id,
        )
        for _, svc in scored[:3]
    ]


async def _collect_sources(
    db: AsyncSession,
    suggested_services: list[SuggestedService],
) -> list[AssistantSource]:
    """Collect official sources from suggested services."""
    if not suggested_services:
        return []

    service_ids = [s.id for s in suggested_services]
    result = await db.execute(
        select(Service)
        .where(Service.id.in_(service_ids))
        .where(Service.primary_source_id.is_not(None))
    )
    services_with_sources = result.scalars().all()

    source_ids = {
        s.primary_source_id
        for s in services_with_sources
        if s.primary_source_id
    }
    if not source_ids:
        return []

    src_result = await db.execute(
        select(Source).where(Source.id.in_(source_ids))
    )
    sources = src_result.scalars().all()

    return [
        AssistantSource(
            name=src.name,
            url=src.url,
            type="official" if src.official else "internal",
            verified_at=src.verified_at.isoformat() if src.verified_at else None,
        )
        for src in sources
    ]


@router.post("/chat", response_model=AssistantResponse)
async def assistant_chat(
    payload: AssistantRequest,
    db: AsyncSession = Depends(get_db),
) -> AssistantResponse:
    """AI chat assistant for Egyptian government services."""
    if not gemini.is_configured:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI assistant is not configured (missing GEMINI_API_KEY)",
        )

    # 1) Classify intent
    intent = classify_intent(payload.message)

    # 2) Build context based on intent
    context, intent_label = await build_context_for_intent(db, intent)
    context = truncate_context(context, max_chars=14000)

    # 3) Build prompt
    history_lines = []
    for msg in payload.history[-6:]:
        role = "المستخدم" if msg.role == "user" else "المساعد"
        history_lines.append(f"{role}: {msg.content}")
    history_text = "\n".join(history_lines) if history_lines else "(لا يوجد سجل)"

    prompt = (
        f"نوع السؤال: {intent_label}\n\n"
        f"السياق (المعلومات المتاحة):\n{context}\n\n"
        f"سجل المحادثة السابق:\n{history_text}\n\n"
        f"رسالة المستخدم الحالية:\n{payload.message}\n\n"
        "المطلوب:\n"
        "1. اكتب رداً واضحاً لا يقل عن 4 جمل.\n"
        "2. إذا ذكرت خدمة، اذكر اسمها الكامل من السياق.\n"
        "3. اذكر المستندات كقائمة مرقمة إن وُجدت.\n"
        "4. اذكر الرسوم إن وُجدت.\n"
        "5. اختم بجملة عن الخطوة التالية.\n"
        "لا تخترع خدمات أو معلومات غير موجودة في السياق."
    )

    # 4) Gemini call
    try:
        reply = await gemini.generate(
            prompt,
            system_instruction=ASSISTANT_SYSTEM_INSTRUCTION,
            temperature=0.3,
            max_output_tokens=1500,
        )
    except GeminiError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI service error: {exc}",
        ) from exc

    if not reply:
        reply = "عذراً، لم أستطع توليد رد. جرّب مرة أخرى."

    # 5) Suggested services
    suggested = await _find_suggested_services(db, reply, payload.message)

    # 6) Collect sources
    sources = await _collect_sources(db, suggested)

    return AssistantResponse(
        reply=reply,
        suggested_services=suggested,
        sources=sources,
        intent=intent_label,
    )