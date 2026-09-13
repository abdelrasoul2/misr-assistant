"use client";

import { useMemo, useState } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import OfficesMapWrapper from "@/components/maps/OfficesMapWrapper";
import PharaohPattern from "@/components/patterns/PharaohPattern";
import { useGovernorates } from "@/features/governorates/hooks";
import { useOffices } from "@/features/offices/hooks";
import {
  OFFICE_TYPE_COLORS,
  OFFICE_TYPE_ICONS,
  OFFICE_TYPE_LABELS,
  type OfficeType,
} from "@/features/offices/types";

const OFFICE_TYPES: { key: OfficeType | "all"; label: string; icon: string }[] = [
  { key: "all", label: "الكل", icon: "🏢" },
  { key: "civil_registry", label: "سجل مدني", icon: "🪪" },
  { key: "traffic", label: "مرور", icon: "🚗" },
  { key: "passport", label: "جوازات", icon: "🛂" },
  { key: "real_estate", label: "شهر عقاري", icon: "📄" },
  { key: "tax", label: "ضرائب", icon: "💰" },
  { key: "court", label: "محكمة", icon: "⚖️" },
  { key: "notary", label: "توثيق", icon: "📝" },
];

type ViewMode = "grid" | "map";

export default function OfficesPage() {
  const [view, setView] = useState<ViewMode>("grid");
  const [govId, setGovId] = useState<number | undefined>();
  const [officeType, setOfficeType] = useState<OfficeType | "all">("all");

  const governorates = useGovernorates();

  // جيب كل المكاتب النشطة مرة واحدة — لحساب أي محافظات عندها بيانات
  const allOffices = useOffices({ page: 1, page_size: 500 });

  // قائمة IDs المحافظات اللي عندها مكاتب
  const govIdsWithOffices = useMemo(() => {
    if (!allOffices.data) return new Set<number>();
    return new Set(allOffices.data.items.map((o) => o.governorate_id));
  }, [allOffices.data]);

  const params: Record<string, unknown> = { page: 1, page_size: 200 };
  if (govId) params.governorate_id = govId;
  if (officeType !== "all") params.office_type = officeType;

  const { data, isLoading, isError } = useOffices(params);

  // اسم المحافظة المختارة (لو موجود)
  const selectedGovName = useMemo(() => {
    if (!govId) return null;
    const g = governorates.data.find((x) => x.id === govId);
    return g ? g.name_ar : null;
  }, [govId, governorates.data]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-sand-50 to-white">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-sand-200">
          <div className="h-1 flex">
            <div className="flex-1 bg-egypt-red" />
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-egypt-black" />
          </div>
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
            <div className="absolute -left-10 -bottom-10 text-[200px] leading-none text-pharaoh-gold">
              𓊪
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-4 py-12 relative text-center">
            <div className="text-5xl mb-4">📍</div>
            <h1 className="text-3xl md:text-5xl font-display font-extrabold mb-3">
              <span className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">
                المصالح الحكومية
              </span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              اعرف مكان كل مكتب حكومي في مصر — مع الخريطة والاتجاهات
            </p>
            <PharaohPattern className="opacity-30 max-w-md mx-auto mt-6" height={20} />
          </div>
        </section>

        {/* Filters + View Toggle */}
        <section className="max-w-6xl mx-auto px-4 py-6 space-y-3">
          {/* View Toggle */}
          <div className="flex items-center justify-center gap-1 bg-white rounded-xl border border-sand-200 p-1 w-fit mx-auto">
            <button
              type="button"
              onClick={() => setView("grid")}
              className={[
                "px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                view === "grid"
                  ? "bg-gradient-to-l from-pharaoh-gold-light to-pharaoh-gold/50 text-egypt-black shadow-sm"
                  : "text-gray-600 hover:bg-sand-50",
              ].join(" ")}
            >
              📋 قائمة
            </button>
            <button
              type="button"
              onClick={() => setView("map")}
              className={[
                "px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                view === "map"
                  ? "bg-gradient-to-l from-pharaoh-gold-light to-pharaoh-gold/50 text-egypt-black shadow-sm"
                  : "text-gray-600 hover:bg-sand-50",
              ].join(" ")}
            >
              🗺️ خريطة
            </button>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2 flex-wrap bg-white rounded-xl border border-sand-200 p-3">
            <span className="text-xs text-gray-500 px-2 font-semibold">
              النوع:
            </span>
            {OFFICE_TYPES.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setOfficeType(t.key)}
                className={[
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  officeType === t.key
                    ? "bg-gradient-to-l from-pharaoh-gold-light to-pharaoh-gold/50 text-egypt-black shadow-sm"
                    : "text-gray-600 hover:bg-sand-50",
                ].join(" ")}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Governorate Filter */}
          <div className="bg-white rounded-xl border border-sand-200 p-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500 px-2 font-semibold">
                المحافظة:
              </span>
              <button
                type="button"
                onClick={() => setGovId(undefined)}
                className={[
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  govId === undefined
                    ? "bg-gradient-to-l from-pharaoh-gold-light to-pharaoh-gold/50 text-egypt-black shadow-sm"
                    : "text-gray-600 hover:bg-sand-50",
                ].join(" ")}
              >
                الكل
              </button>

              {/* المحافظات اللي عندها مكاتب — بلون نشط */}
              {governorates.data
                .filter((g) => govIdsWithOffices.has(g.id))
                .map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGovId(g.id)}
                    className={[
                      "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                      govId === g.id
                        ? "bg-gradient-to-l from-pharaoh-gold-light to-pharaoh-gold/50 text-egypt-black shadow-sm"
                        : "text-gray-700 hover:bg-sand-50",
                    ].join(" ")}
                  >
                    {g.name_ar}
                  </button>
                ))}

              {/* باقي المحافظات — معطّلة بلون باهت */}
              {governorates.data
                .filter((g) => !govIdsWithOffices.has(g.id))
                .map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    disabled
                    title="لا توجد بيانات لهذه المحافظة بعد"
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-300 cursor-not-allowed bg-sand-50/50 border border-dashed border-sand-200"
                  >
                    {g.name_ar}
                  </button>
                ))}
            </div>

            {govIdsWithOffices.size > 0 && govIdsWithOffices.size < governorates.data.length && (
              <p className="text-xs text-gray-400 mt-2 pr-2">
                💡 نعمل على إضافة بيانات لباقي المحافظات قريباً
              </p>
            )}
          </div>
        </section>

        {/* Content */}
        <section className="max-w-6xl mx-auto px-4 pb-16">
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-egypt-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500">جاري التحميل...</p>
              </div>
            </div>
          )}

          {isError && (
            <div className="text-center py-20">
              <div className="text-5xl mb-3">⚠️</div>
              <h2 className="text-xl font-bold text-egypt-red mb-2">
                حدث خطأ في التحميل
              </h2>
            </div>
          )}

          {/* Empty State محسّن */}
          {!isLoading && !isError && data && data.items.length === 0 && (
            <div className="bg-white rounded-2xl border border-sand-200 p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h2 className="text-xl font-display font-bold text-egypt-black mb-2">
                {selectedGovName
                  ? `لا توجد مكاتب مسجّلة في ${selectedGovName} حالياً`
                  : "لا توجد نتائج مطابقة"}
              </h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {selectedGovName
                  ? "نعمل على إضافة المزيد من المكاتب لباقي المحافظات. حالياً، يمكنك الاطلاع على المكاتب المتوفرة في القاهرة والجيزة والإسكندرية."
                  : "جرّب تغيير الفلاتر أو اختر محافظة أخرى"}
              </p>

              {selectedGovName && (
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setGovId(undefined);
                      setOfficeType("all");
                    }}
                    className="px-6 py-2.5 rounded-lg bg-gradient-to-l from-egypt-red-dark to-egypt-red text-white font-bold text-sm shadow-sm hover:shadow-md transition-all"
                  >
                    🏢 عرض كل المكاتب
                  </button>
                </div>
              )}
            </div>
          )}

          {!isLoading && !isError && data && data.items.length > 0 && (
            <>
              {/* Grid View */}
              {view === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.items.map((office) => (
                    <div
                      key={office.id}
                      className="group bg-white rounded-2xl border border-sand-200 p-5 hover:border-pharaoh-gold/50 hover:shadow-lg transition-all overflow-hidden relative"
                    >
                      <div
                        className="absolute top-0 right-0 left-0 h-1"
                        style={{
                          backgroundColor:
                            OFFICE_TYPE_COLORS[office.office_type] || "#d4af37",
                        }}
                      />

                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                          style={{
                            backgroundColor:
                              (OFFICE_TYPE_COLORS[office.office_type] ||
                                "#d4af37") + "20",
                          }}
                        >
                          {OFFICE_TYPE_ICONS[office.office_type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-display font-bold text-base text-egypt-black leading-tight">
                            {office.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {OFFICE_TYPE_LABELS[office.office_type]}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-gray-600 mb-4">
                        <div className="flex items-start gap-1.5">
                          <span className="text-egypt-red shrink-0">📍</span>
                          <span className="line-clamp-2">{office.address}</span>
                        </div>
                        {office.city && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-pharaoh-gold-dark shrink-0">
                              🏙️
                            </span>
                            <span>
                              {office.city}
                              {office.district && ` — ${office.district}`}
                            </span>
                          </div>
                        )}
                        {office.phone && (
                          <div className="flex items-center gap-1.5" dir="ltr">
                            <span className="text-pharaoh-blue shrink-0">📞</span>
                            <span className="font-mono">{office.phone}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${office.latitude},${office.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center py-2 rounded-lg bg-gradient-to-l from-egypt-red-dark to-egypt-red text-white text-xs font-bold shadow-sm hover:shadow-md transition-all"
                        >
                          🧭 الاتجاهات
                        </a>
                        {office.phone && (
                          <a
                            href={`tel:${office.phone}`}
                            className="px-4 py-2 rounded-lg bg-sand-100 hover:bg-sand-200 text-gray-700 text-xs font-bold transition-colors"
                          >
                            📞
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Map View */}
              {view === "map" && (
                <div className="rounded-2xl overflow-hidden">
                  <OfficesMapWrapper offices={data.items} height="700px" />
                </div>
              )}

              <div className="text-center mt-8 text-sm text-gray-500">
                إجمالي{" "}
                <strong className="text-egypt-black">{data.total}</strong> مكتب
                حكومي
                {selectedGovName && ` في ${selectedGovName}`}
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}