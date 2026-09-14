# -*- coding: utf-8 -*-
"""Seed: 4 final services (Education + Notary)."""
import asyncio, sys
from datetime import datetime, timezone
from decimal import Decimal
from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models.category import Category
from app.models.enums import RequirementType, ServiceStatus
from app.models.fee import Fee
from app.models.requirement import Requirement
from app.models.service import Service
from app.models.service_alias import ServiceAlias
from app.models.source import Source
from app.models.step import Step


def U(*codes):
    return "".join(chr(c) for c in codes)


CAT_EDU = U(0x0627,0x0644,0x062A,0x0639,0x0644,0x064A,0x0645)  # التعليم
CAT_NOTARY = U(0x0627,0x0644,0x0634,0x0647,0x0631,0x0020,0x0627,0x0644,0x0639,0x0642,0x0627,0x0631,0x064A)  # الشهر العقاري

# 1. استخراج بيان حالة
S1_NAME = U(0x0627,0x0633,0x062A,0x062E,0x0631,0x0627,0x062C,0x0020,0x0628,0x064A,0x0627,0x0646,0x0020,0x062D,0x0627,0x0644,0x0629)
S1_DESC = U(0x0627,0x0633,0x062A,0x062E,0x0631,0x0627,0x062C,0x0020,0x0628,0x064A,0x0627,0x0646,0x0020,0x062D,0x0627,0x0644,0x0629,0x0020,0x0645,0x0646,0x0020,0x0627,0x0644,0x062C,0x0627,0x0645,0x0639,0x0629,0x0020,0x0623,0x0648,0x0020,0x0627,0x0644,0x0645,0x062F,0x0631,0x0633,0x0629)
S1_ELIG = U(0x0627,0x0644,0x0637,0x0627,0x0644,0x0628,0x0020,0x0623,0x0648,0x0020,0x0627,0x0644,0x062E,0x0631,0x064A,0x062C,0x0648,0x0646)

# 2. تصديق الشهادات
S2_NAME = U(0x062A,0x0635,0x062F,0x064A,0x0642,0x0020,0x0627,0x0644,0x0634,0x0647,0x0627,0x062F,0x0627,0x062A)
S2_DESC = U(0x062A,0x0635,0x062F,0x064A,0x0642,0x0020,0x0627,0x0644,0x0634,0x0647,0x0627,0x062F,0x0627,0x062A,0x0020,0x0627,0x0644,0x062F,0x0631,0x0627,0x0633,0x064A,0x0629,0x0020,0x0645,0x0646,0x0020,0x0627,0x0644,0x062C,0x0647,0x0627,0x062A,0x0020,0x0627,0x0644,0x0645,0x062E,0x062A,0x0635,0x0629)
S2_ELIG = U(0x0627,0x0644,0x0637,0x0644,0x0627,0x0628,0x0020,0x0648,0x0627,0x0644,0x062E,0x0631,0x064A,0x062C,0x0648,0x0646,0x0020,0x0648,0x0627,0x0644,0x0645,0x0648,0x0637,0x0646,0x0648,0x0646)

# 3. توثيق عقد بيع
S3_NAME = U(0x062A,0x0648,0x062B,0x064A,0x0642,0x0020,0x0639,0x0642,0x062F,0x0020,0x0628,0x064A,0x0639)
S3_DESC = U(0x062A,0x0648,0x062B,0x064A,0x0642,0x0020,0x0639,0x0642,0x062F,0x0020,0x0628,0x064A,0x0639,0x0020,0x0644,0x0644,0x0639,0x0642,0x0627,0x0631,0x0020,0x0623,0x0648,0x0020,0x0627,0x0644,0x0633,0x064A,0x0627,0x0631,0x0629)
S3_ELIG = U(0x0627,0x0644,0x0628,0x0627,0x0626,0x0639,0x0020,0x0648,0x0627,0x0644,0x0645,0x0634,0x062A,0x0631,0x064A)

# 4. تسجيل عقار
S4_NAME = U(0x062A,0x0633,0x062C,0x064A,0x0644,0x0020,0x0639,0x0642,0x0627,0x0631)
S4_DESC = U(0x062A,0x0633,0x062C,0x064A,0x0644,0x0020,0x0627,0x0644,0x0639,0x0642,0x0627,0x0631,0x0020,0x0641,0x064A,0x0020,0x0645,0x0635,0x0644,0x062D,0x0629,0x0020,0x0627,0x0644,0x0634,0x0647,0x0631,0x0020,0x0627,0x0644,0x0639,0x0642,0x0627,0x0631,0x064A)
S4_ELIG = U(0x0645,0x0627,0x0644,0x0643,0x0020,0x0627,0x0644,0x0639,0x0642,0x0627,0x0631)

# Requirements
R_NID = U(0x0628,0x0637,0x0627,0x0642,0x0629,0x0020,0x0627,0x0644,0x0631,0x0642,0x0645,0x0020,0x0627,0x0644,0x0642,0x0648,0x0645,0x064A)
R_NID_COPY = U(0x0635,0x0648,0x0631,0x0629,0x0020,0x0645,0x0646,0x0020,0x0628,0x0637,0x0627,0x0642,0x0629,0x0020,0x0627,0x0644,0x0631,0x0642,0x0645,0x0020,0x0627,0x0644,0x0642,0x0648,0x0645,0x064A)
R_ID_CARD = U(0x0628,0x0637,0x0627,0x0642,0x0629,0x0020,0x0627,0x0644,0x0631,0x0642,0x0645,0x0020,0x0627,0x0644,0x0642,0x0648,0x0645,0x064A,0x0020,0x0627,0x0644,0x0623,0x0635,0x0644,0x064A,0x0629)
R_STUDENT_CARD = U(0x0628,0x0637,0x0627,0x0642,0x0629,0x0020,0x0627,0x0644,0x0637,0x0627,0x0644,0x0628)
R_CERTIFICATE = U(0x0627,0x0644,0x0634,0x0647,0x0627,0x062F,0x0629,0x0020,0x0627,0x0644,0x0623,0x0635,0x0644,0x064A,0x0629)
R_OLD_DEED = U(0x0639,0x0642,0x062F,0x0020,0x0627,0x0644,0x0645,0x0644,0x0643,0x064A,0x0629,0x0020,0x0627,0x0644,0x0633,0x0627,0x0628,0x0642)
R_SALE_CONTRACT = U(0x0639,0x0642,0x062F,0x0020,0x0627,0x0644,0x0628,0x064A,0x0639,0x0020,0x0627,0x0644,0x0623,0x0628,0x062A,0x062F,0x0627,0x0626,0x064A)
R_TAX_CLEARANCE = U(0x0645,0x062E,0x0627,0x0644,0x0635,0x0629,0x0020,0x0636,0x0631,0x064A,0x0628,0x064A,0x0629)

# Steps
ST_PREPARE = U(0x062A,0x062C,0x0647,0x064A,0x0632,0x0020,0x0627,0x0644,0x0645,0x0633,0x062A,0x0646,0x062F,0x0627,0x062A)
ST_VISIT = U(0x0627,0x0644,0x062A,0x0648,0x062C,0x0647,0x0020,0x0644,0x0644,0x062C,0x0647,0x0629,0x0020,0x0627,0x0644,0x0645,0x062E,0x062A,0x0635,0x0629)
ST_SUBMIT = U(0x062A,0x0642,0x062F,0x064A,0x0645,0x0020,0x0627,0x0644,0x0637,0x0644,0x0628,0x0020,0x0648,0x0627,0x0644,0x0645,0x0633,0x062A,0x0646,0x062F,0x0627,0x062A)
ST_PAY = U(0x062F,0x0641,0x0639,0x0020,0x0627,0x0644,0x0631,0x0633,0x0648,0x0645)
ST_RECEIVE = U(0x0627,0x0633,0x062A,0x0644,0x0627,0x0645,0x0020,0x0627,0x0644,0x0645,0x0633,0x062A,0x0646,0x062F)

# Aliases
A1_1 = U(0x0639,0x0627,0x064A,0x0632,0x0020,0x0628,0x064A,0x0627,0x0646,0x0020,0x062D,0x0627,0x0644,0x0629)
A1_2 = U(0x0628,0x064A,0x0627,0x0646,0x0020,0x062D,0x0627,0x0644,0x0629,0x0020,0x0645,0x0646,0x0020,0x0627,0x0644,0x062C,0x0627,0x0645,0x0639,0x0629)
A2_1 = U(0x062A,0x0635,0x062F,0x064A,0x0642,0x0020,0x0634,0x0647,0x0627,0x062F,0x0629)
A2_2 = U(0x0639,0x0627,0x064A,0x0632,0x0020,0x0623,0x0635,0x062F,0x0642,0x0020,0x0634,0x0647,0x0627,0x062F,0x062A,0x064A)
A3_1 = U(0x062A,0x0648,0x062B,0x064A,0x0642,0x0020,0x0639,0x0642,0x062F)
A3_2 = U(0x0639,0x0627,0x064A,0x0632,0x0020,0x0623,0x0648,0x062B,0x0642,0x0020,0x0639,0x0642,0x062F)
A4_1 = U(0x062A,0x0633,0x062C,0x064A,0x0644,0x0020,0x0634,0x0642,0x0629)
A4_2 = U(0x062A,0x0633,0x062C,0x064A,0x0644,0x0020,0x0639,0x0642,0x0627,0x0631)


async def seed():
    async with AsyncSessionLocal() as db:
        # Categories
        cat_edu = (await db.execute(select(Category).where(Category.slug == "education"))).scalar_one_or_none()
        if cat_edu is None:
            cat_edu = Category(name=CAT_EDU, slug="education", sort_order=5, is_active=True)
            db.add(cat_edu); await db.commit(); await db.refresh(cat_edu)
            print(f"  Created category: education (id={cat_edu.id})")

        cat_notary = (await db.execute(select(Category).where(Category.slug == "notary"))).scalar_one_or_none()
        if cat_notary is None:
            cat_notary = Category(name=CAT_NOTARY, slug="notary", sort_order=6, is_active=True)
            db.add(cat_notary); await db.commit(); await db.refresh(cat_notary)
            print(f"  Created category: notary (id={cat_notary.id})")

        src = (await db.execute(select(Source).where(Source.url == "https://moi.gov.eg"))).scalar_one_or_none()
        now = datetime.now(timezone.utc)

        # SERVICE 1: بيان حالة
        if (await db.execute(select(Service).where(Service.slug == "status-certificate"))).scalar_one_or_none() is None:
            s = Service(name=S1_NAME, slug="status-certificate", description=S1_DESC, eligibility=S1_ELIG,
                category_id=cat_edu.id, primary_source_id=src.id if src else None,
                status=ServiceStatus.PUBLISHED, last_verified_at=now, verified_by="admin", is_active=True)
            db.add(s); await db.commit(); await db.refresh(s)
            for i, (t, rt) in enumerate([(R_NID_COPY, RequirementType.REQUIRED), (R_STUDENT_CARD, RequirementType.CONDITIONAL)]):
                db.add(Requirement(service_id=s.id, title=t, requirement_type=rt, sort_order=i))
            for n, t in [(1, ST_PREPARE), (2, ST_VISIT), (3, ST_SUBMIT), (4, ST_PAY), (5, ST_RECEIVE)]:
                db.add(Step(service_id=s.id, step_number=n, title=t))
            db.add(Fee(service_id=s.id, source_id=src.id, amount=Decimal("20.00"), currency="EGP", effective_from=now))
            for p, n_, w in [(A1_1, "عايز بيان حالة", 100), (A1_2, "بيان حالة من الجامعة", 95)]:
                db.add(ServiceAlias(service_id=s.id, phrase=p, normalized=n_, weight=w))
            await db.commit()
            print(f"  OK: status-certificate")

        # SERVICE 2: تصديق الشهادات
        if (await db.execute(select(Service).where(Service.slug == "certificate-attestation"))).scalar_one_or_none() is None:
            s = Service(name=S2_NAME, slug="certificate-attestation", description=S2_DESC, eligibility=S2_ELIG,
                category_id=cat_edu.id, primary_source_id=src.id if src else None,
                status=ServiceStatus.PUBLISHED, last_verified_at=now, verified_by="admin", is_active=True)
            db.add(s); await db.commit(); await db.refresh(s)
            for i, (t, rt) in enumerate([(R_CERTIFICATE, RequirementType.REQUIRED), (R_NID_COPY, RequirementType.REQUIRED)]):
                db.add(Requirement(service_id=s.id, title=t, requirement_type=rt, sort_order=i))
            for n, t in [(1, ST_PREPARE), (2, ST_VISIT), (3, ST_SUBMIT), (4, ST_PAY), (5, ST_RECEIVE)]:
                db.add(Step(service_id=s.id, step_number=n, title=t))
            db.add(Fee(service_id=s.id, source_id=src.id, amount=Decimal("15.00"), currency="EGP", effective_from=now))
            for p, n_, w in [(A2_1, "تصديق شهادة", 100), (A2_2, "عايز أصدق شهاداتي", 95)]:
                db.add(ServiceAlias(service_id=s.id, phrase=p, normalized=n_, weight=w))
            await db.commit()
            print(f"  OK: certificate-attestation")

        # SERVICE 3: توثيق عقد بيع
        if (await db.execute(select(Service).where(Service.slug == "contract-notarization"))).scalar_one_or_none() is None:
            s = Service(name=S3_NAME, slug="contract-notarization", description=S3_DESC, eligibility=S3_ELIG,
                category_id=cat_notary.id, primary_source_id=src.id if src else None,
                status=ServiceStatus.PUBLISHED, last_verified_at=now, verified_by="admin", is_active=True)
            db.add(s); await db.commit(); await db.refresh(s)
            for i, (t, rt) in enumerate([(R_ID_CARD, RequirementType.REQUIRED), (R_SALE_CONTRACT, RequirementType.REQUIRED),
                                          (R_OLD_DEED, RequirementType.CONDITIONAL)]):
                db.add(Requirement(service_id=s.id, title=t, requirement_type=rt, sort_order=i))
            for n, t in [(1, ST_PREPARE), (2, ST_VISIT), (3, ST_SUBMIT), (4, ST_PAY), (5, ST_RECEIVE)]:
                db.add(Step(service_id=s.id, step_number=n, title=t))
            db.add(Fee(service_id=s.id, source_id=src.id, amount=Decimal("200.00"), currency="EGP", effective_from=now))
            for p, n_, w in [(A3_1, "توثيق عقد", 100), (A3_2, "عايز أوثق عقد", 100)]:
                db.add(ServiceAlias(service_id=s.id, phrase=p, normalized=n_, weight=w))
            await db.commit()
            print(f"  OK: contract-notarization")

        # SERVICE 4: تسجيل عقار
        if (await db.execute(select(Service).where(Service.slug == "property-registration"))).scalar_one_or_none() is None:
            s = Service(name=S4_NAME, slug="property-registration", description=S4_DESC, eligibility=S4_ELIG,
                category_id=cat_notary.id, primary_source_id=src.id if src else None,
                status=ServiceStatus.PUBLISHED, last_verified_at=now, verified_by="admin", is_active=True)
            db.add(s); await db.commit(); await db.refresh(s)
            for i, (t, rt) in enumerate([(R_ID_CARD, RequirementType.REQUIRED), (R_OLD_DEED, RequirementType.REQUIRED),
                                          (R_TAX_CLEARANCE, RequirementType.REQUIRED)]):
                db.add(Requirement(service_id=s.id, title=t, requirement_type=rt, sort_order=i))
            for n, t in [(1, ST_PREPARE), (2, ST_VISIT), (3, ST_SUBMIT), (4, ST_PAY), (5, ST_RECEIVE)]:
                db.add(Step(service_id=s.id, step_number=n, title=t))
            db.add(Fee(service_id=s.id, source_id=src.id, amount=Decimal("500.00"), currency="EGP", effective_from=now))
            for p, n_, w in [(A4_1, "تسجيل شقة", 100), (A4_2, "تسجيل عقار", 100)]:
                db.add(ServiceAlias(service_id=s.id, phrase=p, normalized=n_, weight=w))
            await db.commit()
            print(f"  OK: property-registration")

        svc = len((await db.execute(select(Service))).scalars().all())
        req = len((await db.execute(select(Requirement))).scalars().all())
        stp = len((await db.execute(select(Step))).scalars().all())
        ali = len((await db.execute(select(ServiceAlias))).scalars().all())
        cat = len((await db.execute(select(Category))).scalars().all())
        print(f"\n=== FINAL COUNTS ===")
        print(f"  Services:     {svc}")
        print(f"  Categories:   {cat}")
        print(f"  Requirements: {req}")
        print(f"  Steps:        {stp}")
        print(f"  Aliases:      {ali}")


if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(seed())