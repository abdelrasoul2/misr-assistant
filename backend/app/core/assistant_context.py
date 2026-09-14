"""Build smart context for the AI assistant based on user intent.

Supports:
- service_query: full service details (requirements, steps, fees)
- location_query: government offices + governorates
- hotline_query: emergency hotlines
- general_query: compact overview of everything
"""
import re

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.emergency_hotline import EmergencyHotline
from app.models.government_office import GovernmentOffice
from app.models.governorate import Governorate
from app.models.service import Service


ASSISTANT_SYSTEM_INSTRUCTION = (
    "أنت 'مساعد مصر' — مساعد حكومي ذكي متخصص في الخدمات الحكومية المصرية. "
    "مهمتك: مساعدة المواطن المصري في فهم الخدمات الحكومية والإجراءات "
    "والمستندات المطلوبة والأماكن والمواعيد. "
    "\n\nقواعد مهمة جداً:\n"
    "1. تحدث بالعربية الفصحى المبسطة، بنبرة ودودة ومحترمة.\n"
    "2. استخدم فقط المعلومات الموجودة في السياق المقدم لك. "
    "لا تخترع معلومات غير موجودة.\n"
    "3. لو ما عندكش معلومة كافية، قل للمستخدم أنه يستفسر من المصدر "
    "الرسمي أو من قسم الشرطة بالمنطقة.\n"
    "4. اذكر الرسوم والمستندات والخطوات بشكل واضح ومنظم.\n"
    "5. حافظ على الرد مختصراً (4-6 جمل أو نقاط).\n"
    "6. لا تعطي نصائح قانونية ملزمة.\n"
    "7. في نهاية الرد، اذكر اسم الخدمة المقترحة بوضوح إن وُجدت.\n"
    "8. اذكر المستندات المطلوبة كقائمة مرقمة.\n"
    "9. اذكر الرسوم إن وُجدت في السياق.\n"
    "10. لا تختصر الرد بشكل مبالغ فيه."
)


# ============ Intent Classification ============
_LOCATION_WORDS = [
    "فين", "وين", "عنوان", "مكان", "أين", "اين", "موقع",
    "أقرب", "اقرب", "قريب", "مكتب", "فرع", "أروح", "اروح",
]
_HOTLINE_WORDS = [
    "رقم", "طوارئ", "إسعاف", "اسعاف", "شرطة", "مطافئ", "نجدة",
    "غاز", "مياه", "كهرباء", "خط", "ساخن", "اتصل",
]
_EMERGENCY_WORDS = [
    "أبلغ", "ابلغ", "شكوى", "شكوي", "بلاغ", "حادث", "حريق",
    "سرقة", "اعتداء", "طوارئ",
]


def classify_intent(message: str) -> str:
    """Classify the user's message intent."""
    normalized = message.lower().strip()

    # Location query
    if any(w in normalized for w in _LOCATION_WORDS):
        return "location_query"

    # Hotline query
    if any(w in normalized for w in _HOTLINE_WORDS):
        return "hotline_query"

    # Emergency query
    if any(w in normalized for w in _EMERGENCY_WORDS):
        return "emergency_query"

    return "service_query"


# ============ Service Context ============
async def build_service_context(
    db: AsyncSession, max_services: int = 20
) -> str:
    """Build a detailed context from all published services."""
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

        if svc.requirements:
            parts.append("    المستندات المطلوبة:")
            for r in sorted(svc.requirements, key=lambda x: x.sort_order):
                req_type = (
                    "مطلوب"
                    if r.requirement_type.value == "required"
                    else "اختياري"
                )
                parts.append(f"      - {r.title} ({req_type})")

        if svc.steps:
            parts.append("    الخطوات:")
            for s in sorted(svc.steps, key=lambda x: x.step_number):
                parts.append(f"      {s.step_number}. {s.title}")

        if svc.fees:
            latest = max(svc.fees, key=lambda x: x.effective_from)
            parts.append(f"    الرسوم: {latest.amount} {latest.currency}")

        if svc.aliases:
            aliases = [a.phrase for a in svc.aliases[:3]]
            parts.append(f"    صيغ شائعة: {', '.join(aliases)}")

    return "\n".join(parts)


# ============ Location Context ============
async def build_location_context(
    db: AsyncSession, max_offices: int = 50
) -> str:
    """Build context from government offices + governorates."""
    parts = ["المصالح الحكومية المتاحة:\n"]

    # Governorates
    gov_result = await db.execute(select(Governorate))
    governorates = gov_result.scalars().all()

    if governorates:
        parts.append("\nالمحافظات المدعومة:")
        parts.append(", ".join(g.name_ar for g in governorates))

    # Offices
    office_result = await db.execute(
        select(GovernmentOffice)
        .where(GovernmentOffice.is_active == True)  # noqa: E712
        .limit(max_offices)
    )
    offices = office_result.scalars().all()

    if not offices:
        parts.append(
            "\nلا توجد مكاتب مسجّلة حالياً. "
            "نعمل على إضافة المزيد قريباً."
        )
        return "\n".join(parts)

    parts.append(f"\nالمكاتب المسجّلة ({len(offices)}):")
    for office in offices:
        parts.append(f"\n{'=' * 60}")
        parts.append(f"• {office.name}")
        parts.append(f"  النوع: {office.office_type.value}")
        if office.city:
            parts.append(f"  المدينة: {office.city}")
        if office.district:
            parts.append(f"  الحي: {office.district}")
        parts.append(f"  العنوان: {office.address}")
        if office.phone:
            parts.append(f"  هاتف: {office.phone}")

    return "\n".join(parts)


# ============ Hotline Context ============
async def build_hotline_context(db: AsyncSession) -> str:
    """Build context from emergency hotlines."""
    result = await db.execute(select(EmergencyHotline))
    hotlines = result.scalars().all()

    if not hotlines:
        return "لا توجد أرقام طوارئ مسجّلة."

    parts = ["أرقام الطوارئ المتاحة:\n"]
    for h in sorted(hotlines, key=lambda x: x.priority):
        parts.append(f"\n• {h.name}")
        parts.append(f"  الرقم: {h.number}")
        if h.description:
            parts.append(f"  الوصف: {h.description}")
        if h.is_national:
            parts.append("  النطاق: وطني")

    return "\n".join(parts)


# ============ General Context ============
async def build_general_context(db: AsyncSession) -> str:
    """Build a compact overview of everything."""
    parts = []

    # Services count
    svc_result = await db.execute(
        select(Service).where(Service.is_active == True)  # noqa: E712
    )
    services = svc_result.scalars().all()
    parts.append(f"عدد الخدمات المتاحة: {len(services)}")
    if services:
        parts.append("أمثلة:")
        for s in services[:8]:
            parts.append(f"  - {s.name} (slug: {s.slug})")

    # Governorates
    gov_result = await db.execute(select(Governorate))
    governorates = gov_result.scalars().all()
    parts.append(f"\nعدد المحافظات: {len(governorates)}")

    # Hotlines
    hotline_result = await db.execute(select(EmergencyHotline))
    hotlines = hotline_result.scalars().all()
    parts.append(f"عدد أرقام الطوارئ: {len(hotlines)}")
    for h in hotlines[:10]:
        parts.append(f"  - {h.number} ({h.name})")

    # Offices
    office_result = await db.execute(
        select(GovernmentOffice).where(GovernmentOffice.is_active == True)  # noqa: E712
    )
    offices = office_result.scalars().all()
    parts.append(f"\nعدد المكاتب الحكومية: {len(offices)}")

    return "\n".join(parts)


# ============ Main Builder ============
async def build_context_for_intent(
    db: AsyncSession, intent: str
) -> tuple[str, str]:
    """Build context based on classified intent.

    Returns:
        (context_text, intent_label)
    """
    if intent == "location_query":
        ctx = await build_location_context(db)
        return ctx, "location"
    if intent == "hotline_query":
        ctx = await build_hotline_context(db)
        return ctx, "hotline"
    if intent == "emergency_query":
        # دمج hotlines + services
        ctx = await build_hotline_context(db)
        return ctx, "emergency"

    # Default: service_query (includes services + brief hotlines)
    services_ctx = await build_service_context(db)
    hotlines_ctx = await build_hotline_context(db)
    combined = services_ctx + "\n\n" + "=" * 60 + "\n" + hotlines_ctx
    return combined, "service"


def truncate_context(text: str, max_chars: int = 14000) -> str:
    """Truncate context to a safe size for Gemini."""
    if len(text) <= max_chars:
        return text
    return text[:max_chars] + "\n\n...(تم اقتصاص القائمة)"