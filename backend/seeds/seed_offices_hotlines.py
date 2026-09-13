"""Seed: government offices + emergency hotlines.

Run: python -m seeds.seed_offices_hotlines
"""
import asyncio
import sys

from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.models.emergency_hotline import EmergencyHotline
from app.models.enums import HotlineType, OfficeType
from app.models.government_office import GovernmentOffice
from app.models.governorate import Governorate


# ============ EMERGENCY HOTLINES (national) ============
# (name, number, type, priority, description)
HOTLINES = [
    # === الأمن ===
    ("الشرطة", "122", HotlineType.POLICE, 1, "خط الطوارئ الموحد لوزارة الداخلية"),
    ("النجدة المرورية", "126", HotlineType.POLICE, 2, "الإدارة العامة للمرور"),
    ("شكاوى وزارة الداخلية", "16111", HotlineType.COMPLAINTS, 4, "خدمة شكاوى المواطنين"),
    # === الإسعاف والصحة ===
    ("الإسعاف", "123", HotlineType.AMBULANCE, 1, "هيئة الإسعاف المصرية"),
    ("وزارة الصحة", "155", HotlineType.HEALTH, 2, "خط ساخن لوزارة الصحة والسكان"),
    ("هيئة الإسعاف (بديل)", "16556", HotlineType.AMBULANCE, 3, "خط بديل لهيئة الإسعاف"),
    ("هيئة الدواء", "15301", HotlineType.HEALTH, 5, "استفسارات وشكاوى الأدوية"),
    # === المطافئ ===
    ("المطافئ", "180", HotlineType.FIRE, 1, "الحماية المدنية والإطفاء"),
    # === المرافق ===
    ("طوارئ الغاز", "129", HotlineType.GAS, 1, "طوارئ الغاز الطبيعي"),
    ("طوارئ المياه", "125", HotlineType.WATER, 1, "طوارئ مياه الشرب والصرف"),
    ("طوارئ الكهرباء", "121", HotlineType.ELECTRICITY, 1, "طوارئ الكهرباء"),
    ("طوارئ الصرف", "128", HotlineType.SEWAGE, 1, "طوارئ الصرف الصحي"),
    # === الجهات الرقابية ===
    ("الرقابة الإدارية", "120", HotlineType.COMPLAINTS, 3, "هيئة الرقابة الإدارية"),
    ("حماية المستهلك", "16000", HotlineType.CONSUMER, 2, "جهاز حماية المستهلك"),
    ("مجلس الوزراء", "151", HotlineType.COMPLAINTS, 3, "مكتب شكاوى مجلس الوزراء"),
    # === خدمات عامة ===
    ("البريد المصري", "16528", HotlineType.OTHER, 5, "خدمة عملاء البريد المصري"),
    ("الطوارئ الطبية", "137", HotlineType.HEALTH, 3, "خط الطوارئ الطبية"),
    ("الدعم الفني للإنترنت", "111", HotlineType.OTHER, 6, "المصرية للاتصالات"),
    # === وزارات ===
    ("وزارة المالية", "16408", HotlineType.OTHER, 5, "خط ساخن لوزارة المالية"),
    ("مصلحة الضرائب", "16395", HotlineType.OTHER, 5, "استفسارات ضريبية"),
    ("التأمينات الاجتماعية", "16217", HotlineType.OTHER, 5, "الهيئة القومية للتأمين الاجتماعي"),
    ("التعليم", "19136", HotlineType.OTHER, 5, "خط ساخن لوزارة التربية والتعليم"),
    ("وزارة العدل", "16517", HotlineType.OTHER, 5, "خط ساخن لوزارة العدل"),
    ("السكك الحديدية", "120100", HotlineType.OTHER, 4, "استفسارات ومعلومات القطارات"),
    ("حماية الأراضي", "16012", HotlineType.COMPLAINTS, 4, "حماية الأراضي الزراعية"),
]


# ============ GOVERNMENT OFFICES ============
# (name, slug, office_type, gov_code, city, district, address, lat, lng, phone)
OFFICES = [
    # === سجلات مدنية (القاهرة) ===
    ("سجل مدني العباسية", "civil-registry-abbassia", OfficeType.CIVIL_REGISTRY, "CAI", "القاهرة", "العباسية", "شارع الخليفة المأمون، العباسية", 30.0626, 31.2797, "02-24847011"),
    ("سجل مدني مدينة نصر", "civil-registry-nasr-city", OfficeType.CIVIL_REGISTRY, "CAI", "القاهرة", "مدينة نصر", "شارع عباس العقاد، مدينة نصر", 30.0587, 31.3305, "02-22612945"),
    ("سجل مدني المعادي", "civil-registry-maadi", OfficeType.CIVIL_REGISTRY, "CAI", "القاهرة", "المعادي", "شارع 9، المعادي", 29.9603, 31.2569, "02-25255533"),
    ("سجل مدني شبرا", "civil-registry-shubra", OfficeType.CIVIL_REGISTRY, "CAI", "القاهرة", "شبرا", "شارع شبرا الرئيسي", 30.0943, 31.2452, "02-22023344"),

    # === سجلات مدنية (الجيزة) ===
    ("سجل مدني الدقي", "civil-registry-dokki", OfficeType.CIVIL_REGISTRY, "GIZ", "الجيزة", "الدقي", "شارع التحرير، الدقي", 30.0381, 31.2111, "02-33365522"),
    ("سجل مدني المهندسين", "civil-registry-mohandessin", OfficeType.CIVIL_REGISTRY, "GIZ", "الجيزة", "المهندسين", "شارع جامعة الدول العربية", 30.0589, 31.2000, "02-33442211"),
    ("سجل مدني الهرم", "civil-registry-haram", OfficeType.CIVIL_REGISTRY, "GIZ", "الجيزة", "الهرم", "شارع الهرم الرئيسي", 29.9792, 31.1342, "02-35875011"),

    # === سجلات مدنية (الإسكندرية) ===
    ("سجل مدني المنشية", "civil-registry-manshia", OfficeType.CIVIL_REGISTRY, "ALX", "الإسكندرية", "المنشية", "ميدان المنشية", 31.1985, 29.8885, "03-4865001"),
    ("سجل مدني سموحة", "civil-registry-smouha", OfficeType.CIVIL_REGISTRY, "ALX", "الإسكندرية", "سموحة", "شارع فوزي معاذ، سموحة", 31.2154, 29.9524, "03-4270111"),

    # === مرور (القاهرة) ===
    ("إدارة مرور القاهرة", "traffic-cairo", OfficeType.TRAFFIC, "CAI", "القاهرة", "العباسية", "شارع الخليفة المأمون، العباسية", 30.0650, 31.2800, "02-24840000"),
    ("مرور مدينة نصر", "traffic-nasr-city", OfficeType.TRAFFIC, "CAI", "القاهرة", "مدينة نصر", "الحي السابع، مدينة نصر", 30.0512, 31.3670, "02-22615678"),
    ("مرور مصر الجديدة", "traffic-heliopolis", OfficeType.TRAFFIC, "CAI", "القاهرة", "مصر الجديدة", "شارع الحجاز، مصر الجديدة", 30.0872, 31.3293, "02-24189900"),

    # === مرور (الجيزة) ===
    ("مرور الجيزة", "traffic-giza", OfficeType.TRAFFIC, "GIZ", "الجيزة", "الدقي", "شارع البحر الأعظم", 30.0245, 31.2078, "02-35730011"),
    ("مرور 6 أكتوبر", "traffic-6october", OfficeType.TRAFFIC, "GIZ", "6 أكتوبر", "الحي الأول", "الحي الأول، مدينة 6 أكتوبر", 29.9725, 30.9446, "02-38370011"),

    # === مرور (الإسكندرية) ===
    ("إدارة مرور الإسكندرية", "traffic-alex", OfficeType.TRAFFIC, "ALX", "الإسكندرية", "المنشية", "شارع فؤاد، المنشية", 31.1976, 29.8925, "03-4861888"),

    # === جوازات (القاهرة) ===
    ("مصلحة الجوازات والهجرة", "passport-cairo", OfficeType.PASSPORT, "CAI", "القاهرة", "العباسية", "شارع الخليفة المأمون، العباسية", 30.0680, 31.2820, "02-24847777"),
    ("مجمع الجوازات بالتحرير", "passport-tahrir", OfficeType.PASSPORT, "CAI", "القاهرة", "وسط البلد", "ميدان التحرير", 30.0444, 31.2357, "02-25747777"),

    # === جوازات (الجيزة + الإسكندرية) ===
    ("جوازات الجيزة", "passport-giza", OfficeType.PASSPORT, "GIZ", "الجيزة", "الدقي", "شارع التحرير، الدقي", 30.0381, 31.2111, "02-33365533"),
    ("جوازات الإسكندرية", "passport-alex", OfficeType.PASSPORT, "ALX", "الإسكندرية", "المنشية", "شارع صلاح سالم، المنشية", 31.1968, 29.8898, "03-4863555"),

    # === شهر عقاري (القاهرة) ===
    ("الشهر العقاري - العباسية", "real-estate-abbassia", OfficeType.REAL_ESTATE, "CAI", "القاهرة", "العباسية", "شارع الخليفة المأمون، العباسية", 30.0620, 31.2785, "02-24847700"),
    ("الشهر العقاري - الدقي", "real-estate-dokki", OfficeType.REAL_ESTATE, "GIZ", "الجيزة", "الدقي", "شارع التحرير، الدقي", 30.0388, 31.2118, "02-33365544"),
    ("الشهر العقاري - سموحة", "real-estate-smouha", OfficeType.REAL_ESTATE, "ALX", "الإسكندرية", "سموحة", "شارع فوزي معاذ، سموحة", 31.2158, 29.9520, "03-4270333"),

    # === ضرائب (القاهرة) ===
    ("مأمورية ضرائب مدينة نصر", "tax-nasr-city", OfficeType.TAX, "CAI", "القاهرة", "مدينة نصر", "الحي العاشر، مدينة نصر", 30.0512, 31.3670, "02-22615555"),
    ("مأمورية ضرائب الدقي", "tax-dokki", OfficeType.TAX, "GIZ", "الجيزة", "الدقي", "شارع التحرير، الدقي", 30.0390, 31.2120, "02-33365666"),

    # === محاكم (القاهرة) ===
    ("محكمة شمال القاهرة الابتدائية", "court-north-cairo", OfficeType.COURT, "CAI", "القاهرة", "العباسية", "شارع رمسيس، العباسية", 30.0640, 31.2780, "02-24847788"),
    ("محكمة جنوب القاهرة الابتدائية", "court-south-cairo", OfficeType.COURT, "CAI", "القاهرة", "المعادي", "شارع 9، المعادي", 29.9600, 31.2570, "02-25255566"),

    # === توثيق (القاهرة + الجيزة) ===
    ("مكتب توثيق العباسية", "notary-abbassia", OfficeType.NOTARY, "CAI", "القاهرة", "العباسية", "شارع الخليفة المأمون، العباسية", 30.0620, 31.2780, "02-24842200"),
    ("مكتب توثيق المهندسين", "notary-mohandessin", OfficeType.NOTARY, "GIZ", "الجيزة", "المهندسين", "شارع جامعة الدول العربية", 30.0589, 31.2000, "02-33443300"),
]


async def seed():
    async with AsyncSessionLocal() as db:
        # ===== Hotlines =====
        print("\n[1/2] Seeding emergency hotlines...")
        existing = set((await db.execute(select(EmergencyHotline.number))).scalars().all())
        added_h = 0
        for name, number, htype, priority, desc in HOTLINES:
            if number in existing:
                continue
            db.add(EmergencyHotline(
                name=name, number=number, hotline_type=htype,
                priority=priority, description=desc,
                is_national=True, is_24_7=True, is_toll_free=True,
            ))
            added_h += 1
        await db.commit()
        print(f"  Added: {added_h} hotlines")

        # ===== Offices =====
        print("\n[2/2] Seeding government offices...")
        gov_map = {}
        result = await db.execute(select(Governorate.code, Governorate.id))
        for code, gid in result.all():
            gov_map[code] = gid

        existing = set((await db.execute(select(GovernmentOffice.slug))).scalars().all())
        added_o = 0
        for name, slug, otype, gov_code, city, district, addr, lat, lng, phone in OFFICES:
            if slug in existing:
                continue
            gid = gov_map.get(gov_code)
            if not gid:
                print(f"  WARN: governorate {gov_code!r} not found for {slug}")
                continue
            from decimal import Decimal
            db.add(GovernmentOffice(
                name=name, slug=slug, office_type=otype,
                governorate_id=gid, city=city, district=district,
                address=addr, latitude=Decimal(str(lat)), longitude=Decimal(str(lng)),
                phone=phone,
                is_active=True,
                working_hours={"sat_thu": "08:00-14:00", "fri": "closed"},
            ))
            added_o += 1
        await db.commit()
        print(f"  Added: {added_o} offices")

        # ===== Final =====
        print("\n" + "=" * 50)
        print("FINAL COUNTS")
        print("=" * 50)
        for Model, label in [
            (EmergencyHotline, "Hotlines"),
            (GovernmentOffice, "Offices"),
        ]:
            count = len((await db.execute(select(Model))).scalars().all())
            print(f"  {label:25} {count}")
        print("=" * 50)


if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(seed())