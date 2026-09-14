"""AI Assistant chat endpoint."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.assistant_context import (
    ASSISTANT_SYSTEM_INSTRUCTION,
    build_services_context,
    build_short_context,
)
from app.core.gemini import GeminiError, gemini
from app.core.text_normalizer import normalize_arabic
from app.db.session import get_db
from app.models.service import Service
from app.schemas.assistant import (
    AssistantRequest,
    AssistantResponse,
    SuggestedService,
)

router = APIRouter(prefix="/assistant", tags=["assistant"])


async def _find_suggested_services(
    db: AsyncSession,
    reply: str,
    user_message: str,
) -> list[SuggestedService]:
    """Find services mentioned in the AI reply."""
    # ابحث في كل الخدمات عن أسماء ظهرت في الرد
    result = await db.execute(
        select(Service).where(Service.is_active == True)  # noqa: E712
    )
    services = result.scalars().all()

    reply_norm = normalize_arabic(reply)
    user_norm = normalize_arabic(user_message)
    combined = reply_norm + " " + user_norm

    suggested: list[SuggestedService] = []
    seen_ids: set[int] = set()

    for svc in services:
        if svc.id in seen_ids:
            continue
        svc_name_norm = normalize_arabic(svc.name)
        # ابحث عن اسم الخدمة ككلمة كاملة أو جزء مهم
        words = [w for w in svc_name_norm.split() if len(w) > 3]
        matches = sum(1 for w in words if w in combined)
        if matches >= 2 or svc_name_norm in combined:
            suggested.append(
                SuggestedService(
                    id=svc.id,
                    name=svc.name,
                    slug=svc.slug,
                    description=svc.description,
                    category_id=svc.category_id,
                )
            )
            seen_ids.add(svc.id)
            if len(suggested) >= 3:
                break

    return suggested


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

    # 1) ابني context من الخدمات
    services_context = await build_services_context(db, max_services=20)
    services_context = build_short_context(services_context, max_chars=12000)

    # 2) ابني الـ prompt
    history_lines = []
    for msg in payload.history[-6:]:  # آخر 6 رسائل فقط
        role = "المستخدم" if msg.role == "user" else "المساعد"
        history_lines.append(f"{role}: {msg.content}")
    history_text = "\n".join(history_lines) if history_lines else "(لا يوجد سجل)"

    prompt = (
        f"السياق (قائمة الخدمات المتاحة):\n{services_context}\n\n"
        f"سجل المحادثة السابق:\n{history_text}\n\n"
        f"رسالة المستخدم الحالية:\n{payload.message}\n\n"
        "المطلوب:\n"
        "1. اكتب رداً واضحاً لا يقل عن 4 جمل.\n"
        "2. اذكر اسم الخدمة الكامل من السياق بشكل صريح.\n"
        "3. اذكر المستندات المطلوبة كقائمة.\n"
        "4. اذكر الرسوم إن وُجدت.\n"
        "5. اختم بجملة عن الخطوة التالية.\n"
        "لا تخترع خدمات أو معلومات غير موجودة في السياق."
    )

    # 3) اتصل بـ Gemini
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

    # 4) اقترح خدمات
    suggested = await _find_suggested_services(db, reply, payload.message)

    return AssistantResponse(
        reply=reply,
        suggested_services=suggested,
    )