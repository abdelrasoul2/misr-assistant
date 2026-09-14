"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PharaohPattern from "@/components/patterns/PharaohPattern";
import { useAISearch, useSuggestions } from "@/features/search/hooks";
import { CATEGORY_ICONS } from "@/features/services/types";

const CATEGORY_LABELS: Record<number, string> = {
  2: "الرقم القومي",
  3: "الجوازات",
  4: "المرور",
  5: "المستندات",
  6: "التعليم",
  7: "الشهر العقاري",
};

const CATEGORY_SLUGS = ["national-id", "passports", "traffic", "documents", "education", "notary"];

function getIcon(categoryId: number): string {
  const slug = CATEGORY_SLUGS[categoryId - 2];
  return CATEGORY_ICONS[slug] ?? "📄";
}

const SAMPLE_QUERIES = [
  "بطاقة ضاعت",
  "عايز أطلع جواز",
  "رخصة قيادة",
  "فيش وتشبيه",
  "شهادة ميلاد",
];

export default function SearchPage() {
  const [input, setInput] = useState("");
  const [debounced, setDebounced] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") ?? "";
    if (q) {
      setInput(q);
      setDebounced(q);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => setDebounced(input), 300);
    return () => clearTimeout(timer);
  }, [input, ready]);

  const { data, isLoading, isError } = useAISearch(debounced, debounced.length > 0);
  const suggestions = useSuggestions(input);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-sand-50 to-white">
        <section className="relative overflow-hidden border-b border-sand-200">
          <div className="h-1 flex">
            <div className="flex-1 bg-egypt-red" />
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-black" />
          </div>
          <div className="max-w-4xl mx-auto px-4 py-12 relative">
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">🔍</div>
              <h1 className="text-3xl md:text-4xl font-display font-extrabold mb-2">
                <span className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">
                  ابحث عن أي خدمة
                </span>
              </h1>
              <p className="text-gray-500 text-sm flex items-center justify-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] bg-gradient-to-l from-pharaoh-gold/20 to-pharaoh-gold/10 text-pharaoh-gold-dark border border-pharaoh-gold/30 px-2 py-0.5 rounded-full font-semibold">
                  ✨ مدعوم بـ AI
                </span>
                <span>اكتب بلغتك — المنصة تفهمك</span>
              </p>
            </div>

            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="مثال: بطاقتي ضاعت، عايز أطلع جواز، رخصة..."
                className="w-full px-6 py-5 pr-16 rounded-2xl border-2 border-sand-200 bg-white text-base shadow-sm focus:outline-none focus:border-pharaoh-gold focus:ring-4 focus:ring-pharaoh-gold/10 transition-all"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl pointer-events-none">
                🔍
              </div>

              {suggestions && suggestions.items.length > 0 && input.length >= 2 && (
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl border border-sand-200 shadow-xl z-20 overflow-hidden">
                  {suggestions.items.slice(0, 6).map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setInput(s.text)}
                      className="w-full text-right px-4 py-3 hover:bg-sand-50 border-b border-sand-100 last:border-0 transition-colors flex items-center gap-3 cursor-pointer"
                    >
                      <span className="text-sm text-gray-400">
                        {s.type === "alias" ? "💡" : "📄"}
                      </span>
                      <span className="text-sm text-egypt-black flex-1">{s.text}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {!input.trim() && (
          <section className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-6">
              <div className="text-sm text-gray-500 mb-3">جرّب البحث بكلمات مختلفة:</div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {SAMPLE_QUERIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setInput(q)}
                    className="px-4 py-2 rounded-full bg-white border border-sand-200 hover:border-pharaoh-gold/50 text-sm text-gray-700 hover:text-egypt-red transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
            <PharaohPattern className="opacity-20 max-w-xs mx-auto" height={20} />
          </section>
        )}

        {input.trim() && (
          <section className="max-w-4xl mx-auto px-4 py-10">
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-10 h-10 border-4 border-egypt-red border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">جاري البحث والتحليل...</p>
                </div>
              </div>
            )}

            {isError && (
              <div className="text-center py-12 bg-white rounded-2xl border border-red-200">
                <div className="text-4xl mb-3">⚠️</div>
                <p className="text-egypt-red font-semibold mb-2">حدث خطأ في البحث</p>
              </div>
            )}

            {!isLoading && !isError && data && data.ai_explanation && (
              <div className="mb-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-pharaoh-gold/10 via-sand-50 to-white border-2 border-pharaoh-gold/40 shadow-md">
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-l from-egypt-red via-pharaoh-gold to-egypt-black" />

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pharaoh-gold to-pharaoh-gold-dark flex items-center justify-center text-xl shadow-sm">
                      ✨
                    </div>
                    <div>
                      <div className="font-display font-bold text-lg text-egypt-black">
                        شرح ذكي
                      </div>
                      <div className="text-[10px] text-pharaoh-gold-dark font-semibold tracking-wide">
                        مدعوم بـ Google Gemini
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-800 leading-relaxed text-sm whitespace-pre-wrap">
                    {data.ai_explanation}
                  </p>

                  <div className="mt-4 pt-4 border-t border-pharaoh-gold/20 flex items-start gap-2 text-xs text-gray-500">
                    <span className="text-base leading-none">⚠️</span>
                    <span>{data.disclaimer}</span>
                  </div>
                </div>
              </div>
            )}

            {!isLoading && !isError && data && data.total === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-sand-200">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-display font-bold text-egypt-black mb-2">
                  لم نجد نتائج مطابقة
                </h3>
                <p className="text-sm text-gray-500">جرّب كلمات أخرى</p>
              </div>
            )}

            {!isLoading && !isError && data && data.total > 0 && (
              <>
                <div className="text-sm text-gray-500 mb-4">
                  <strong className="text-egypt-black">{data.total}</strong> نتيجة لـ{" "}
                  <strong className="text-egypt-red">&quot;{data.query}&quot;</strong>
                </div>

                <div className="space-y-3">
                  {data.items.map((item) => (
                    <Link
                      key={item.id}
                      href={`/services/${item.slug}`}
                      className="block bg-white rounded-2xl border border-sand-200 p-5 hover:border-pharaoh-gold/50 hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sand-100 to-sand-50 flex items-center justify-center text-2xl shrink-0 border border-sand-200">
                          {getIcon(item.category_id)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-[10px] font-medium bg-pharaoh-gold/15 text-pharaoh-gold-dark border border-pharaoh-gold/30 px-2 py-0.5 rounded-full">
                              {CATEGORY_LABELS[item.category_id] ?? "خدمة"}
                            </span>
                            {item.match_type === "alias" && (
                              <span className="text-[10px] font-medium bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                                ✓ مطابقة ذكية
                              </span>
                            )}
                          </div>
                          <h3 className="font-display font-bold text-lg text-egypt-black group-hover:text-egypt-red transition-colors leading-tight">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <span className="text-pharaoh-gold text-lg self-center">←</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}