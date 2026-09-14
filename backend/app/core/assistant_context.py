"""Build context for the AI assistant from database services.

Compact representation of all services + their requirements, steps, fees.
"""
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.service import Service

# Common system instruction for the assistant
ASSISTANT_SYSTEM_INSTRUCTION = (
    "أنت 'مساعد مصر' — مساعد حكومي ذكي متخصص في الخدمات الحكومية المصرية. "
    "مهمتك: مساعدة المواطن المصري في فهم الخدمات الحكومية والإجراءات والمستندات "
    "المطلوبة. "
    "قواعد مهمة جداً:\n"
    "1. تحدث بالعربية الفصحى المبسطة، بنبرة ودودة ومحترمة.\n"
    "2. استخدم فقط المعلومات الموجودة في السياق المقدم لك. "
    "لا تخترع معلومات غير موجودة.\n"
    "3. لو ما عندكش معلومة كافية، قل للمستخدم أنه يستفسر من المصدر الرسمي.\n"
    "4. اذكر الرسوم والمستندات والخطوات بشكل واضح ومنظم.\n"
    "5. حافظ على الرد مختصراً (3-6 جمل أو نقاط).\n"
    "6. لا تعطي نصائح قانونية ملزمة.\n"
    "7. في نهاية الرد، اذكر اسم الخدمة المقترحة بوضوح.\n"
    "8. اذكر المستندات المطلوبة كقائمة مرقمة.\n"
    "9. اذكر الرسوم إن وُجدت في السياق.\n"
    "10. لا تختصر الرد بشكل مبالغ فيه — اكتب 4-6 جمل على الأقل."
)


async def build_services_context(db: AsyncSession, max_services: int = 20) -> str:
    """Build a compact text context from all published services.

    Returns:
        A formatted string with services + their details.
    """
    stmt = (
        select(Service)
        .where(Service.is_active == True)  # noqa: E712
        .options(
            selectinload(Service.requirements),
            selectinload(Service.steps),
            selectinload(Service.fees),
            selectinload(Service.aliases),
        )
        .limit(max_services)
    )
    result = await db.execute(stmt)
    services = result.scalars().all()

    if not services:
        return "لا توجد خدمات متاحة حالياً."

    parts = ["الخدمات الحكومية المتاحة:\n"]

    for i, svc in enumerate(services, 1):
        parts.append(f"\n{'=' * 60}")
        parts.append(f"[{i}] {svc.name}")
        parts.append(f"    Slug: {svc.slug}")
        if svc.description:
            parts.append(f"    الوصف: {svc.description}")
        if svc.eligibility:
            parts.append(f"    من يستطيع التقديم: {svc.eligibility}")

        # Requirements
        if svc.requirements:
            parts.append("    المستندات المطلوبة:")
            for r in sorted(svc.requirements, key=lambda x: x.sort_order):
                req_type = "مطلوب" if r.requirement_type.value == "required" else "اختياري"
                parts.append(f"      - {r.title} ({req_type})")

        # Steps (just titles)
        if svc.steps:
            parts.append("    الخطوات:")
            for s in sorted(svc.steps, key=lambda x: x.step_number):
                parts.append(f"      {s.step_number}. {s.title}")

        # Fees (latest)
        if svc.fees:
            latest = max(svc.fees, key=lambda x: x.effective_from)
            parts.append(f"    الرسوم: {latest.amount} {latest.currency}")

        # Aliases (a few)
        if svc.aliases:
            aliases = [a.phrase for a in svc.aliases[:3]]
            parts.append(f"    صيغ شائعة: {', '.join(aliases)}")

    return "\n".join(parts)


def build_short_context(services_context: str, max_chars: int = 12000) -> str:
    """Truncate context to a safe size for Gemini."""
    if len(services_context) <= max_chars:
        return services_context
    return services_context[:max_chars] + "\n\n...(تم اقتصاص القائمة)"