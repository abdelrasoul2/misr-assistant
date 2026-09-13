"use client";

import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PharaohPattern from "@/components/patterns/PharaohPattern";
import { useSectors } from "@/features/sectors/hooks";

export default function SectorsPage() {
  const { data, isLoading, isError } = useSectors();

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
              𓂀
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-4 py-12 relative text-center">
            <div className="text-5xl mb-4">⚖️</div>
            <h1 className="text-3xl md:text-5xl font-display font-extrabold mb-3">
              <span className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">
                القطاعات الحكومية
              </span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              اختر القطاع للبدء — كل قطاع يحتوي على الوزارات والهيئات والمصالح التابعة له
            </p>
            <PharaohPattern className="opacity-30 max-w-md mx-auto mt-6" height={20} />
          </div>
        </section>

        {/* Content */}
        <section className="max-w-6xl mx-auto px-4 py-12">
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

          {!isLoading && !isError && data.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-gray-500">لا توجد قطاعات</p>
            </div>
          )}

          {!isLoading && !isError && data.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {data.map((s) => (
                  <Link
                    key={s.id}
                    href={`/sectors/${s.slug}`}
                    className="group relative bg-white rounded-2xl border border-sand-200 p-6 hover:border-pharaoh-gold/50 hover:shadow-lg transition-all overflow-hidden"
                  >
                    {/* Colored top bar */}
                    <div
                      className="absolute top-0 right-0 left-0 h-1.5"
                      style={{ backgroundColor: s.color ?? "#d4af37" }}
                    />

                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
                        style={{
                          backgroundColor: (s.color ?? "#d4af37") + "20",
                        }}
                      >
                        {s.icon ?? "🏛️"}
                      </div>
                      <div
                        className="text-xs px-2 py-1 rounded-full font-mono"
                        style={{
                          backgroundColor: (s.color ?? "#d4af37") + "20",
                          color: s.color ?? "#d4af37",
                        }}
                      >
                        #{s.sort_order}
                      </div>
                    </div>

                    <h3 className="font-display font-bold text-xl text-egypt-black mb-2 group-hover:text-egypt-red transition-colors">
                      {s.name}
                    </h3>

                    <code className="text-xs bg-sand-100 px-2 py-0.5 rounded text-gray-600">
                      {s.slug}
                    </code>

                    {s.description && (
                      <p className="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-2">
                        {s.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-sand-100">
                      <span className="text-xs text-gray-400">
                        اضغط للتفاصيل
                      </span>
                      <span
                        className="text-lg transition-transform group-hover:-translate-x-1"
                        style={{ color: s.color ?? "#d4af37" }}
                      >
                        ←
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-10 text-sm text-gray-500">
                إجمالي <strong className="text-egypt-black">{data.length}</strong> قطاع حكومي
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}