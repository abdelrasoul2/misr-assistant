"use client";

import { useState } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PharaohPattern from "@/components/patterns/PharaohPattern";
import { useHotlines } from "./hooks";
import {
  HOTLINE_TYPE_ICONS,
  HOTLINE_TYPE_LABELS,
  type HotlineType,
} from "@/features/hotlines/types";

const FILTERS: { key: HotlineType | "all"; label: string; icon: string }[] = [
  { key: "all", label: "الكل", icon: "📞" },
  { key: "police", label: "شرطة", icon: "🚓" },
  { key: "ambulance", label: "إسعاف", icon: "🚑" },
  { key: "fire", label: "مطافئ", icon: "🚒" },
  { key: "gas", label: "غاز", icon: "💨" },
  { key: "water", label: "مياه", icon: "💧" },
  { key: "electricity", label: "كهرباء", icon: "⚡" },
  { key: "health", label: "صحة", icon: "🏥" },
  { key: "complaints", label: "شكاوى", icon: "📢" },
  { key: "consumer", label: "مستهلك", icon: "🛒" },
];

export default function HotlinesPage() {
  const [filter, setFilter] = useState<HotlineType | "all">("all");
  const params =
    filter === "all"
      ? { page: 1, page_size: 100 }
      : { page: 1, page_size: 100, hotline_type: filter };

  const { data, isLoading, isError } = useHotlines(params);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-sand-50 to-white">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-l from-red-50 via-sand-50 to-white border-b border-egypt-red/20">
          <div className="h-1 flex">
            <div className="flex-1 bg-egypt-red" />
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-egypt-black" />
          </div>
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
            <div className="absolute -left-10 -bottom-10 text-[200px] leading-none text-egypt-red">
              𓊹
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-4 py-12 relative text-center">
            <div className="text-5xl mb-4">🚨</div>
            <h1 className="text-3xl md:text-5xl font-display font-extrabold mb-3">
              <span className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">
                أرقام الطوارئ
              </span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              اتصل مباشرة من أي مكان — جميع خطوط الطوارئ في مكان واحد
            </p>
            <PharaohPattern className="opacity-30 max-w-md mx-auto mt-6" height={20} />
          </div>
        </section>

        {/* Filters */}
        <section className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 flex-wrap bg-white rounded-xl border border-sand-200 p-3">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={[
                  "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  filter === f.key
                    ? "bg-gradient-to-l from-egypt-red/20 to-egypt-red/10 text-egypt-red-dark shadow-sm border border-egypt-red/30"
                    : "text-gray-600 hover:bg-sand-50",
                ].join(" ")}
              >
                <span>{f.icon}</span>
                <span>{f.label}</span>
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

          {!isLoading && !isError && data && data.items.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-3">📞</div>
              <p className="text-gray-500">لا توجد أرقام متاحة</p>
            </div>
          )}

          {!isLoading && !isError && data && data.items.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.items.map((h) => (
                  <div
                    key={h.id}
                    className="group bg-white rounded-2xl border border-sand-200 p-6 hover:border-egypt-red/50 hover:shadow-lg transition-all overflow-hidden relative"
                  >
                    {/* Top bar */}
                    <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-l from-egypt-red to-egypt-red-dark" />

                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center text-3xl shrink-0">
                        {HOTLINE_TYPE_ICONS[h.hotline_type] || "📞"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-display font-bold text-lg text-egypt-black truncate">
                          {h.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {HOTLINE_TYPE_LABELS[h.hotline_type] || h.hotline_type}
                        </div>
                      </div>
                    </div>

                    <div
                      className="text-4xl font-display font-extrabold text-egypt-red mb-4 text-center tracking-wider"
                      dir="ltr"
                    >
                      {h.number}
                    </div>

                    {h.description && (
                      <p className="text-xs text-gray-500 mb-4 line-clamp-2 text-center">
                        {h.description}
                      </p>
                    )}

                    <a
                      href={`tel:${h.number}`}
                      className="block w-full text-center py-2.5 rounded-xl bg-gradient-to-l from-egypt-red-dark to-egypt-red text-white font-bold text-sm shadow-sm hover:shadow-md hover:brightness-105 transition-all"
                    >
                      📞 اتصل الآن
                    </a>
                  </div>
                ))}
              </div>

              <div className="text-center mt-8 text-sm text-gray-500">
                إجمالي <strong className="text-egypt-black">{data.total}</strong> رقم طوارئ
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}