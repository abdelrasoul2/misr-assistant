"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PharaohPattern from "@/components/patterns/PharaohPattern";
import { useServices } from "@/features/services/hooks";
import { CATEGORY_ICONS } from "@/features/services/types";

const CATEGORY_LABELS: Record<number, string> = {
  2: "الرقم القومي",
  3: "الجوازات",
  4: "المرور",
  5: "المستندات",
  6: "التعليم",
  7: "الشهر العقاري",
};

const CATEGORY_FILTERS: { id: number | "all"; label: string; icon: string }[] = [
  { id: "all", label: "الكل", icon: "📋" },
  { id: 2, label: "الرقم القومي", icon: "🪪" },
  { id: 3, label: "الجوازات", icon: "🛂" },
  { id: 4, label: "المرور", icon: "🚗" },
  { id: 5, label: "المستندات", icon: "📄" },
  { id: 6, label: "التعليم", icon: "🎓" },
  { id: 7, label: "الشهر العقاري", icon: "📝" },
];

export default function ServicesPage() {
  const [filter, setFilter] = useState<number | "all">("all");
  const [search, setSearch] = useState("");

  const params = useMemo(
    () => ({
      page: 1,
      page_size: 100,
      is_active: true,
      status: "published" as const,
      ...(filter !== "all" ? { category_id: filter } : {}),
    }),
    [filter]
  );

  const { data, isLoading, isError } = useServices(params);

  const filtered = useMemo(() => {
    const items = data?.items ?? [];
    if (!search.trim()) return items;
    const q = search.trim().toLowerCase();
    return items.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        (s.description?.toLowerCase() ?? "").includes(q)
    );
  }, [data, search]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-sand-50 to-white">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-sand-200">
          <div className="h-1 flex">
            <div className="flex-1 bg-egypt-red" />
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-black" />
          </div>
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
            <div className="absolute -left-10 -bottom-10 text-[200px] leading-none text-pharaoh-gold">
              𓀀
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-4 py-12 relative text-center">
            <div className="text-5xl mb-4">📄</div>
            <h1 className="text-3xl md:text-5xl font-display font-extrabold mb-3">
              <span className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">
                الخدمات الحكومية
              </span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              كل ما تحتاجه لإنجاز معاملتك الحكومية في مكان واحد
            </p>
            <PharaohPattern className="opacity-30 max-w-md mx-auto mt-6" height={20} />
          </div>
        </section>

        {/* Search + Filters */}
        <section className="max-w-6xl mx-auto px-4 py-6 space-y-3">
          {/* Search */}
          <div className="bg-white rounded-xl border border-sand-200 p-3 flex items-center gap-3">
            <span className="text-pharaoh-gold text-lg px-2">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم أو الوصف..."
              className="flex-1 px-3 py-2 rounded-lg border-0 bg-transparent text-sm focus:outline-none placeholder:text-gray-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-xs text-gray-400 hover:text-egypt-red px-2"
                type="button"
              >
                مسح ✕
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 flex-wrap bg-white rounded-xl border border-sand-200 p-3">
            {CATEGORY_FILTERS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setFilter(c.id)}
                className={[
                  "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  filter === c.id
                    ? "bg-gradient-to-l from-pharaoh-gold-light to-pharaoh-gold/50 text-egypt-black shadow-sm border border-pharaoh-gold/40"
                    : "text-gray-600 hover:bg-sand-50",
                ].join(" ")}
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
              </button>
            ))}
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
              <p className="text-gray-500 text-sm">
                تأكد من الاتصال بالخادم وحاول مرة أخرى
              </p>
            </div>
          )}

          {!isLoading && !isError && filtered.length === 0 && (
            <div className="bg-white rounded-2xl border border-sand-200 p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h2 className="text-xl font-display font-bold text-egypt-black mb-2">
                {search ? "لا توجد نتائج مطابقة" : "لا توجد خدمات في هذا القسم"}
              </h2>
              <p className="text-gray-500">
                {search ? "جرب البحث بكلمة أخرى" : "اختر قسماً آخر أو ابحث"}
              </p>
            </div>
          )}

          {!isLoading && !isError && filtered.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((service) => {
                  const catSlug = Object.keys(CATEGORY_ICONS).find(
                    (_, idx) => Object.values(CATEGORY_LABELS)[idx] === CATEGORY_LABELS[service.category_id]
                  );
                  const icon = CATEGORY_ICONS[
                    ["national-id", "passports", "traffic", "documents", "education", "notary"][
                      service.category_id - 2
                    ]
                  ] ?? "📄";
                  const categoryLabel = CATEGORY_LABELS[service.category_id] ?? "خدمة";

                  return (
                    <Link
                      key={service.id}
                      href={`/services/${service.slug}`}
                      className="group bg-white rounded-2xl border border-sand-200 p-6 hover:border-pharaoh-gold/50 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sand-100 to-sand-50 flex items-center justify-center text-3xl shrink-0 border border-sand-200">
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="inline-block text-[10px] font-medium bg-pharaoh-gold/15 text-pharaoh-gold-dark border border-pharaoh-gold/30 px-2 py-0.5 rounded-full mb-2">
                            {categoryLabel}
                          </span>
                          <h3 className="font-display font-bold text-lg text-egypt-black group-hover:text-egypt-red transition-colors leading-tight">
                            {service.name}
                          </h3>
                        </div>
                      </div>

                      {service.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                          {service.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-sand-100">
                        <span className="text-xs text-gray-400">
                          اضغط للتفاصيل
                        </span>
                        <span className="text-pharaoh-gold text-lg transition-transform group-hover:-translate-x-1">
                          ←
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="text-center mt-10 text-sm text-gray-500">
                إجمالي{" "}
                <strong className="text-egypt-black">{filtered.length}</strong>{" "}
                خدمة متاحة
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}