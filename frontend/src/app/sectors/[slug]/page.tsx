"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PharaohPattern from "@/components/patterns/PharaohPattern";
import { useSector, useSectorEntities } from "@/features/sectors/hooks";
import {
  ENTITY_TYPE_LABELS,
  type GovernmentEntity,
  type Sector,
} from "@/features/sectors/types";

const ENTITY_TYPE_ICONS: Record<GovernmentEntity["entity_type"], string> = {
  ministry: "🏛️",
  authority: "⚖️",
  agency: "🏢",
  directorate: "📍",
  administration: "🗂️",
  council: "👥",
  other: "📌",
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function SectorDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const [sectorId, setSectorId] = useState<number | null>(null);
  const [lookupDone, setLookupDone] = useState(false);

  // Fetch all sectors to find by slug (simple approach for MVP)
  useEffect(() => {
    let cancelled = false;
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1"}/sectors?page=1&page_size=100`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const found = (data.items as Sector[]).find((s) => s.slug === slug);
        if (found) {
          setSectorId(found.id);
        }
        setLookupDone(true);
      })
      .catch(() => {
        if (!cancelled) setLookupDone(true);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const sector = useSector(sectorId);
  const entities = useSectorEntities(sectorId);

  const isLoading = !lookupDone || sector.isLoading || entities.isLoading;
  const notFound = lookupDone && sectorId === null;
  const isError = sector.isError || entities.isError;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-sand-50 to-white">
        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-egypt-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">جاري التحميل...</p>
            </div>
          </div>
        )}

        {/* Not found */}
        {notFound && (
          <section className="max-w-4xl mx-auto px-4 py-20 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-3xl font-display font-bold text-egypt-black mb-3">
              القطاع غير موجود
            </h1>
            <p className="text-gray-500 mb-6">
              عذراً، لم نجد قطاعاً بهذا الاسم
            </p>
            <Link
              href="/sectors"
              className="inline-block px-6 py-3 rounded-xl bg-gradient-to-l from-egypt-red-dark to-egypt-red text-white font-bold shadow-md hover:shadow-lg transition-all"
            >
              ← العودة للقطاعات
            </Link>
          </section>
        )}

        {/* Error */}
        {isError && !isLoading && !notFound && (
          <section className="max-w-4xl mx-auto px-4 py-20 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-egypt-red mb-3">
              حدث خطأ في التحميل
            </h1>
            <Link
              href="/sectors"
              className="text-egypt-red hover:underline"
            >
              ← العودة للقطاعات
            </Link>
          </section>
        )}

        {/* Content */}
        {!isLoading && !notFound && !isError && sector.data && (
          <>
            {/* Hero */}
            <section className="relative overflow-hidden border-b border-sand-200">
              <div
                className="h-1.5"
                style={{ backgroundColor: sector.data.color ?? "#d4af37" }}
              />
              <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundColor: sector.data.color ?? "#d4af37" }}
              />
              <div className="max-w-6xl mx-auto px-4 py-12 relative">
                <Link
                  href="/sectors"
                  className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-egypt-red mb-6 transition-colors"
                >
                  <span>←</span>
                  <span>العودة للقطاعات</span>
                </Link>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div
                    className="w-20 h-20 md:w-24 md:h-24 rounded-3xl flex items-center justify-center text-5xl shadow-lg shrink-0"
                    style={{
                      backgroundColor: (sector.data.color ?? "#d4af37") + "25",
                    }}
                  >
                    {sector.data.icon ?? "🏛️"}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl md:text-5xl font-display font-extrabold mb-3">
                      <span
                        className="bg-clip-text text-transparent"
                        style={{
                          backgroundImage: `linear-gradient(to left, #8B0000, #CE1126, ${
                            sector.data.color ?? "#d4af37"
                          })`,
                        }}
                      >
                        {sector.data.name}
                      </span>
                    </h1>
                    <code className="inline-block text-xs bg-white/70 border border-sand-200 px-3 py-1 rounded-full text-gray-600">
                      {sector.data.slug}
                    </code>
                  </div>
                </div>

                {sector.data.description && (
                  <p className="text-gray-600 mt-6 max-w-3xl leading-relaxed">
                    {sector.data.description}
                  </p>
                )}

                <PharaohPattern
                  className="opacity-30 max-w-md mt-8"
                  height={20}
                />
              </div>
            </section>

            {/* Entities */}
            <section className="max-w-6xl mx-auto px-4 py-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-8 rounded-full bg-egypt-red" />
                <h2 className="text-2xl font-display font-extrabold text-egypt-black">
                  الجهات التابعة
                </h2>
                <span className="text-sm text-gray-500">
                  ({entities.data.length})
                </span>
              </div>

              {entities.data.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-sand-200">
                  <div className="text-5xl mb-3">📭</div>
                  <p className="text-gray-500">
                    لا توجد جهات مسجّلة في هذا القطاع حالياً
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    نعمل على إضافتها قريباً
                  </p>
                </div>
              )}

              {entities.data.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {entities.data.map((e) => (
                    <div
                      key={e.id}
                      className="group bg-white rounded-2xl border border-sand-200 p-5 hover:border-pharaoh-gold/50 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sand-100 to-sand-50 flex items-center justify-center text-3xl shrink-0 border border-sand-200">
                          {ENTITY_TYPE_ICONS[e.entity_type]}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-display font-bold text-lg text-egypt-black leading-tight">
                              {e.name}
                            </h3>
                          </div>

                          {e.short_name && (
                            <div className="text-xs text-gray-500 mb-2">
                              {e.short_name}
                            </div>
                          )}

                          <span className="inline-block text-[10px] font-medium bg-pharaoh-gold/15 text-pharaoh-gold-dark border border-pharaoh-gold/30 px-2 py-0.5 rounded-full mb-3">
                            {ENTITY_TYPE_LABELS[e.entity_type]}
                          </span>

                          {e.description && (
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                              {e.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            {e.phone && (
                              <a
                                href={`tel:${e.phone}`}
                                className="inline-flex items-center gap-1 text-pharaoh-blue hover:text-pharaoh-lapis transition-colors"
                                dir="ltr"
                              >
                                <span>📞</span>
                                <span className="font-mono">{e.phone}</span>
                              </a>
                            )}
                            {e.website && (
                              <a
                                href={e.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-egypt-red hover:text-egypt-red-dark transition-colors"
                              >
                                <span>🌐</span>
                                <span>زيارة الموقع</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}