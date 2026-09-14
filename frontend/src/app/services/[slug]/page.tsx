"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PharaohPattern from "@/components/patterns/PharaohPattern";
import { useFullService } from "@/features/services/hooks";
import {
  CATEGORY_ICONS,
  REQUIREMENT_TYPE_LABELS,
} from "@/features/services/types";

const CATEGORY_LABELS: Record<number, string> = {
  2: "الرقم القومي",
  3: "الجوازات",
  4: "المرور",
  5: "المستندات",
  6: "التعليم",
  7: "الشهر العقاري",
};

const CATEGORY_SLUGS = [
  "national-id",
  "passports",
  "traffic",
  "documents",
  "education",
  "notary",
];

function getIcon(categoryId: number): string {
  const slug = CATEGORY_SLUGS[categoryId - 2];
  return CATEGORY_ICONS[slug] ?? "📄";
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ServiceDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const { data, isLoading, isError } = useFullService(slug);
  const [checkedReqs, setCheckedReqs] = useState<Set<number>>(new Set());

  // Load checked requirements from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(`service-checklist-${slug}`);
    if (saved) {
      try {
        const ids = JSON.parse(saved) as number[];
        setCheckedReqs(new Set(ids));
      } catch {}
    }
  }, [slug]);

  const toggleReq = (id: number) => {
    setCheckedReqs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(
          `service-checklist-${slug}`,
          JSON.stringify(Array.from(next))
        );
      }
      return next;
    });
  };

  const handleShare = async () => {
    if (!data) return;
    const svc = data.service;
    const text =
      `📄 ${svc.name}\n\n` +
      `📋 المستندات المطلوبة:\n` +
      data.requirements
        .map((r) => `☐ ${r.title}`)
        .join("\n") +
      `\n\n` +
      (data.fees[0]
        ? `💰 الرسوم: ${data.fees[0].amount} ${data.fees[0].currency}\n\n`
        : "") +
      `🔗 ${typeof window !== "undefined" ? window.location.href : ""}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: svc.name, text });
      } catch {}
    } else {
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-egypt-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">جاري التحميل...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Error state
  if (isError || !data) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-display font-bold text-egypt-black mb-2">
              الخدمة غير موجودة
            </h1>
            <p className="text-gray-500 mb-6">
              عذراً، لم نجد هذه الخدمة في قاعدة البيانات
            </p>
            <Link
              href="/services"
              className="inline-block px-6 py-3 rounded-xl bg-gradient-to-l from-egypt-red-dark to-egypt-red text-white font-bold shadow-md hover:shadow-lg transition-all"
            >
              ← العودة للخدمات
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const svc = data.service;
  const latestFee = data.fees.length > 0
    ? data.fees.reduce((a, b) =>
        new Date(a.effective_from) > new Date(b.effective_from) ? a : b
      )
    : null;

  const requiredReqs = data.requirements.filter(
    (r) => r.requirement_type === "required"
  );
  const optionalReqs = data.requirements.filter(
    (r) => r.requirement_type !== "required"
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-sand-50 to-white">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-sand-200 print:hidden">
          <div className="h-1 flex">
            <div className="flex-1 bg-egypt-red" />
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-black" />
          </div>
          <div className="max-w-5xl mx-auto px-4 py-8 relative">
            <Link
              href="/services"
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-egypt-red mb-5 transition-colors"
            >
              <span>←</span>
              <span>العودة للخدمات</span>
            </Link>

            <div className="flex items-start gap-5">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-sand-100 to-sand-50 flex items-center justify-center text-5xl shadow-md shrink-0 border border-sand-200">
                {getIcon(svc.category_id)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="text-xs font-medium bg-pharaoh-gold/15 text-pharaoh-gold-dark border border-pharaoh-gold/30 px-3 py-1 rounded-full">
                    {CATEGORY_LABELS[svc.category_id] ?? "خدمة"}
                  </span>
                  <span className="text-xs font-medium bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full">
                    ✓ منشور
                  </span>
                </div>
                <h1 className="text-2xl md:text-4xl font-display font-extrabold text-egypt-black leading-tight mb-3">
                  {svc.name}
                </h1>
                {svc.description && (
                  <p className="text-gray-600 leading-relaxed">
                    {svc.description}
                  </p>
                )}
              </div>
            </div>

            <PharaohPattern className="opacity-20 mt-6" height={20} />

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-l from-green-600 to-green-700 text-white font-bold text-sm shadow-sm hover:shadow-md transition-all"
              >
                📤 شارك
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-sand-200 text-gray-700 font-bold text-sm hover:border-pharaoh-gold/50 transition-all"
              >
                🖨️ اطبع
              </button>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-5xl mx-auto px-4 py-10 space-y-8">
          {/* Eligibility */}
          {svc.eligibility && (
            <div className="bg-white rounded-2xl border border-sand-200 p-6 print:border-gray-300">
              <h2 className="font-display font-bold text-lg text-egypt-black mb-3 flex items-center gap-2">
                <span className="text-pharaoh-gold text-xl">👤</span>
                من يستطيع التقديم
              </h2>
              <p className="text-gray-700 leading-relaxed">{svc.eligibility}</p>
            </div>
          )}

          {/* Requirements Checklist */}
          {data.requirements.length > 0 && (
            <div className="bg-white rounded-2xl border border-sand-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-bold text-lg text-egypt-black flex items-center gap-2">
                  <span className="text-pharaoh-gold text-xl">📋</span>
                  المستندات المطلوبة
                  <span className="text-xs text-gray-500 font-normal">
                    ({checkedReqs.size}/{data.requirements.length})
                  </span>
                </h2>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-sand-100 rounded-full overflow-hidden mb-5 print:hidden">
                <div
                  className="h-full bg-gradient-to-l from-green-500 to-green-600 transition-all duration-300"
                  style={{
                    width: `${
                      (checkedReqs.size / data.requirements.length) * 100
                    }%`,
                  }}
                />
              </div>

              <div className="space-y-3">
                {[...requiredReqs, ...optionalReqs].map((r) => (
                  <label
                    key={r.id}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-sand-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checkedReqs.has(r.id)}
                      onChange={() => toggleReq(r.id)}
                      className="w-5 h-5 mt-0.5 rounded border-sand-300 text-egypt-red focus:ring-egypt-red cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div
                        className={
                          "font-semibold text-sm " +
                          (checkedReqs.has(r.id)
                            ? "line-through text-gray-400"
                            : "text-egypt-black")
                        }
                      >
                        {r.title}
                      </div>
                      {r.description && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          {r.description}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={
                            "text-[10px] font-medium px-2 py-0.5 rounded-full " +
                            (r.requirement_type === "required"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : "bg-yellow-50 text-yellow-700 border border-yellow-200")
                          }
                        >
                          {REQUIREMENT_TYPE_LABELS[r.requirement_type]}
                        </span>
                        {r.condition_note && (
                          <span className="text-[10px] text-gray-400">
                            ({r.condition_note})
                          </span>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Steps */}
          {data.steps.length > 0 && (
            <div className="bg-white rounded-2xl border border-sand-200 p-6">
              <h2 className="font-display font-bold text-lg text-egypt-black mb-5 flex items-center gap-2">
                <span className="text-pharaoh-gold text-xl">📝</span>
                الخطوات
              </h2>
              <ol className="space-y-4">
                {[...data.steps]
                  .sort((a, b) => a.step_number - b.step_number)
                  .map((s) => (
                    <li key={s.id} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-egypt-red to-egypt-red-dark text-white font-bold flex items-center justify-center shrink-0 text-sm shadow-sm">
                        {s.step_number}
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="font-semibold text-egypt-black">
                          {s.title}
                        </div>
                        {s.description && (
                          <div className="text-sm text-gray-600 mt-1">
                            {s.description}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
              </ol>
            </div>
          )}

          {/* Fee */}
          {latestFee && (
            <div className="bg-gradient-to-br from-pharaoh-gold/10 to-white rounded-2xl border-2 border-pharaoh-gold/40 p-6">
              <h2 className="font-display font-bold text-lg text-egypt-black mb-3 flex items-center gap-2">
                <span className="text-pharaoh-gold text-xl">💰</span>
                الرسوم
              </h2>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-display font-extrabold text-egypt-red">
                  {latestFee.amount}
                </span>
                <span className="text-lg font-bold text-gray-600">
                  {latestFee.currency}
                </span>
              </div>
              {latestFee.description && (
                <div className="text-sm text-gray-600 mt-2">
                  {latestFee.description}
                </div>
              )}
              <div className="text-xs text-gray-500 mt-3 pt-3 border-t border-pharaoh-gold/20">
                آخر تحديث:{" "}
                {new Date(latestFee.effective_from).toLocaleDateString("ar-EG")}
              </div>
            </div>
          )}

          {/* Aliases */}
          {data.aliases.length > 0 && (
            <div className="bg-white rounded-2xl border border-sand-200 p-6">
              <h2 className="font-display font-bold text-lg text-egypt-black mb-3 flex items-center gap-2">
                <span className="text-pharaoh-gold text-xl">💡</span>
                صيغ أخرى
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.aliases.map((a) => (
                  <span
                    key={a.id}
                    className="px-3 py-1 rounded-full bg-sand-100 text-sm text-gray-700 border border-sand-200"
                  >
                    {a.phrase}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Official Source */}
          {svc.official_url && (
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
              <h2 className="font-display font-bold text-lg text-egypt-black mb-3 flex items-center gap-2">
                <span className="text-blue-600 text-xl">🔗</span>
                المصدر الرسمي
              </h2>
              <a
                href={svc.official_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-l from-blue-600 to-blue-700 text-white font-bold shadow-sm hover:shadow-md transition-all"
              >
                <span>زيارة الموقع الرسمي</span>
                <span>→</span>
              </a>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-red-50 rounded-2xl border border-red-200 p-5 flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <div className="font-bold text-egypt-red-dark mb-1 text-sm">
                ملاحظة مهمة
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                المعلومات للاسترشاد فقط. تحقق دائماً من المصدر الرسمي قبل
                الشروع في أي معاملة. قد تتغير المستندات والرسوم والمواعيد.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}