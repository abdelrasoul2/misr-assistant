"""Seed data: governorates, sectors, government entities.

Run: python -m seeds.seed_government
"""
import asyncio
import sys
from decimal import Decimal

from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.models.governorate import Governorate
from app.models.sector import Sector
from app.models.government_entity import GovernmentEntity
from app.models.enums import EntityType


GOVERNORATES = [
    # code, name_ar, name_en, region, lat, lng
    ("CAI", "القاهرة", "Cairo", "القاهرة الكبرى", 30.0444, 31.2357),
    ("GIZ", "الجيزة", "Giza", "القاهرة الكبرى", 30.0131, 31.2089),
    ("QAL", "القليوبية", "Qalyubia", "القاهرة الكبرى", 30.4100, 31.2100),
    ("ALX", "الإسكندرية", "Alexandria", "الإسكندرية", 31.2001, 29.9187),
    ("DAQ", "الدقهلية", "Dakahlia", "الدلتا", 31.0500, 31.3800),
    ("SHR", "الشرقية", "Sharqia", "الدلتا", 30.5800, 31.5000),
    ("GHR", "الغربية", "Gharbia", "الدلتا", 30.8700, 31.0300),
    ("MNF", "المنوفية", "Monufia", "الدلتا", 30.5200, 30.9900),
    ("BEH", "البحيرة", "Beheira", "الدلتا", 30.8500, 30.3400),
    ("KFS", "كفر الشيخ", "Kafr El Sheikh", "الدلتا", 31.1100, 30.9400),
    ("DAM", "دمياط", "Damietta", "الدلتا", 31.4200, 31.8100),
    ("PTS", "بورسعيد", "Port Said", "القناة", 31.2600, 32.3000),
    ("ISM", "الإسماعيلية", "Ismailia", "القناة", 30.6000, 32.2700),
    ("SUZ", "السويس", "Suez", "القناة", 29.9700, 32.5300),
    ("NSI", "شمال سيناء", "North Sinai", "سيناء", 31.1000, 33.8000),
    ("SSI", "جنوب سيناء", "South Sinai", "سيناء", 28.5400, 33.9500),
    ("FYM", "الفيوم", "Fayoum", "الصعيد", 29.3100, 30.8400),
    ("BNS", "بني سويف", "Beni Suef", "الصعيد", 29.0700, 31.1000),
    ("MNY", "المنيا", "Minya", "الصعيد", 28.1000, 30.7500),
    ("ASY", "أسيوط", "Assiut", "الصعيد", 27.1800, 31.1800),
    ("SHG", "سوهاج", "Sohag", "الصعيد", 26.5600, 31.6900),
    ("QNA", "قنا", "Qena", "الصعيد", 26.1600, 32.7200),
    ("LXR", "الأقصر", "Luxor", "الصعيد", 25.6900, 32.6400),
    ("ASW", "أسوان", "Aswan", "الصعيد", 24.0900, 32.9000),
    ("RSE", "البحر الأحمر", "Red Sea", "الحدود", 26.0000, 33.8000),
    ("WAD", "الوادي الجديد", "New Valley", "الحدود", 25.4500, 30.5500),
    ("MTH", "مطروح", "Matrouh", "الحدود", 31.3500, 27.2400),
]


SECTORS = [
    # slug, name, icon, color, sort_order
    ("emergency", "الطوارئ والخدمات العاجلة", "🚨", "#DC2626", 1),
    ("justice", "القضاء والنيابة", "⚖️", "#1E40AF", 2),
    ("interior", "الداخلية والأمن", "🛡️", "#0F172A", 3),
    ("health", "الصحة والسكان", "🏥", "#059669", 4),
    ("education", "التعليم", "🎓", "#7C3AED", 5),
    ("local-government", "الحكم المحلي", "🏛️", "#0891B2", 6),
    ("finance", "المالية والضرائب", "💰", "#CA8A04", 7),
    ("housing", "الإسكان والمرافق", "🏗️", "#EA580C", 8),
    ("agriculture", "الزراعة والري", "🌾", "#65A30D", 9),
    ("transport", "النقل والمواصلات", "🚢", "#0284C7", 10),
    ("manpower", "القوى العاملة", "💼", "#B45309", 11),
    ("notary", "الشهر العقاري والتوثيق", "📄", "#4338CA", 12),
]


ENTITIES = [
    # slug, name, short_name, type, sector_slug, website, phone
    # ==== الطوارئ ====
    ("emergency-authority", "هيئة الإسعاف المصرية", "الإسعاف", EntityType.AUTHORITY, "emergency", "https://www.ema.gov.eg", "123"),

    # ==== القضاء ====
    ("ministry-justice", "وزارة العدل", "العدل", EntityType.MINISTRY, "justice", "https://www.moj.gov.eg", "16517"),
    ("public-prosecution", "النيابة العامة", "النيابة", EntityType.AUTHORITY, "justice", None, None),
    ("state-council", "مجلس الدولة", "مجلس الدولة", EntityType.COUNCIL, "justice", None, None),
    ("state-lawsuits-authority", "هيئة قضايا الدولة", "قضايا الدولة", EntityType.AUTHORITY, "justice", None, None),

    # ==== الداخلية ====
    ("ministry-interior", "وزارة الداخلية", "الداخلية", EntityType.MINISTRY, "interior", "https://www.moi.gov.eg", "122"),
    ("passports-authority", "مصلحة الجوازات والهجرة والجنسية", "الجوازات", EntityType.AUTHORITY, "interior", None, None),
    ("civil-registry-authority", "مصلحة الأحوال المدنية", "الأحوال المدنية", EntityType.AUTHORITY, "interior", None, None),
    ("traffic-authority", "الإدارة العامة للمرور", "المرور", EntityType.AUTHORITY, "interior", None, "126"),

    # ==== الصحة ====
    ("ministry-health", "وزارة الصحة والسكان", "الصحة", EntityType.MINISTRY, "health", "https://www.mohp.gov.eg", "155"),
    ("egyptian-drug-authority", "هيئة الدواء المصرية", "الدواء", EntityType.AUTHORITY, "health", "https://www.edaegypt.gov.eg", "15301"),
    ("health-insurance-authority", "الهيئة العامة للتأمين الصحي", "التأمين الصحي", EntityType.AUTHORITY, "health", None, None),
    ("hospitals-authority", "الهيئة العامة للمستشفيات والمعاهد التعليمية", "المستشفيات التعليمية", EntityType.AUTHORITY, "health", None, None),

    # ==== التعليم ====
    ("ministry-education", "وزارة التربية والتعليم", "التعليم", EntityType.MINISTRY, "education", "https://moe.gov.eg", "19136"),
    ("ministry-higher-education", "وزارة التعليم العالي والبحث العلمي", "التعليم العالي", EntityType.MINISTRY, "education", "https://mohesr.gov.eg", None),
    ("azhar", "الأزهر الشريف", "الأزهر", EntityType.AUTHORITY, "education", "https://www.azhar.eg", None),
    ("supreme-council-universities", "المجلس الأعلى للجامعات", "المجلس الأعلى", EntityType.COUNCIL, "education", None, None),

    # ==== المالية ====
    ("ministry-finance", "وزارة المالية", "المالية", EntityType.MINISTRY, "finance", "https://www.mof.gov.eg", "16408"),
    ("tax-authority", "مصلحة الضرائب المصرية", "الضرائب", EntityType.AUTHORITY, "finance", "https://www.eta.gov.eg", "16395"),
    ("customs-authority", "مصلحة الجمارك المصرية", "الجمارك", EntityType.AUTHORITY, "finance", "https://www.customs.gov.eg", None),

    # ==== الشهر العقاري ====
    ("real-estate-authority", "مصلحة الشهر العقاري والتوثيق", "الشهر العقاري", EntityType.AUTHORITY, "notary", "https://www.realestate.gov.eg", None),

    # ==== الإسكان ====
    ("ministry-housing", "وزارة الإسكان والمرافق والمجتمعات العمرانية", "الإسكان", EntityType.MINISTRY, "housing", "https://www.mhuc.gov.eg", None),
    ("water-holding", "الشركة القابضة لمياه الشرب والصرف الصحي", "مياه الشرب", EntityType.AUTHORITY, "housing", "https://www.hcww.com.eg", "125"),

    # ==== الزراعة ====
    ("ministry-agriculture", "وزارة الزراعة واستصلاح الأراضي", "الزراعة", EntityType.MINISTRY, "agriculture", "https://www.agr.gov.eg", None),

    # ==== النقل ====
    ("ministry-transport", "وزارة النقل", "النقل", EntityType.MINISTRY, "transport", "https://www.mot.gov.eg", None),
    ("railways-authority", "الهيئة القومية لسكك حديد مصر", "السكك الحديدية", EntityType.AUTHORITY, "transport", "https://enr.gov.eg", "120100"),
    ("metro-authority", "الشركة المصرية لإدارة وتشغيل مترو الأنفاق", "المترو", EntityType.AUTHORITY, "transport", None, None),

    # ==== القوى العاملة ====
    ("ministry-manpower", "وزارة القوى العاملة", "القوى العاملة", EntityType.MINISTRY, "manpower", "https://www.manpower.gov.eg", None),
    ("national-organization-social-insurance", "الهيئة القومية للتأمين الاجتماعي", "التأمينات", EntityType.AUTHORITY, "manpower", "https://www.nosi.gov.eg", "16217"),

    # ==== الحكم المحلي ====
    ("ministry-local-development", "وزارة التنمية المحلية", "التنمية المحلية", EntityType.MINISTRY, "local-government", "https://www.mld.gov.eg", None),
]


async def seed():
    async with AsyncSessionLocal() as db:
        # ===== Governorates =====
        print("\n[1/3] Seeding governorates...")
        existing = (await db.execute(select(Governorate.code))).scalars().all()
        added = 0
        for code, name_ar, name_en, region, lat, lng in GOVERNORATES:
            if code in existing:
                continue
            db.add(Governorate(
                code=code, name_ar=name_ar, name_en=name_en, region=region,
                latitude=Decimal(str(lat)), longitude=Decimal(str(lng)),
            ))
            added += 1
        await db.commit()
        print(f"  Added: {added} governorates")

        # ===== Sectors =====
        print("\n[2/3] Seeding sectors...")
        existing = (await db.execute(select(Sector.slug))).scalars().all()
        added = 0
        for slug, name, icon, color, order in SECTORS:
            if slug in existing:
                continue
            db.add(Sector(
                slug=slug, name=name, icon=icon, color=color, sort_order=order,
            ))
            added += 1
        await db.commit()
        print(f"  Added: {added} sectors")

        # ===== Government Entities =====
        print("\n[3/3] Seeding government entities...")
        # جيب mapping للـ sectors
        sector_map = {}
        result = await db.execute(select(Sector.slug, Sector.id))
        for slug, sid in result.all():
            sector_map[slug] = sid

        existing = (await db.execute(select(GovernmentEntity.slug))).scalars().all()
        added = 0
        for slug, name, short_name, entity_type, sector_slug, website, phone in ENTITIES:
            if slug in existing:
                continue
            db.add(GovernmentEntity(
                slug=slug, name=name, short_name=short_name,
                entity_type=entity_type,
                sector_id=sector_map.get(sector_slug),
                website=website, phone=phone,
            ))
            added += 1
        await db.commit()
        print(f"  Added: {added} entities")

        # ===== Final Count =====
        print("\n" + "=" * 50)
        print("FINAL COUNTS")
        print("=" * 50)
        for Model, label in [
            (Governorate, "Governorates"),
            (Sector, "Sectors"),
            (GovernmentEntity, "Government Entities"),
        ]:
            count = len((await db.execute(select(Model))).scalars().all())
            print(f"  {label:25} {count}")
        print("=" * 50)


if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(seed())