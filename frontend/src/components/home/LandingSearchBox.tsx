"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const EXAMPLES = [
  "بطاقتي ضاعت",
  "عايز أطلع جواز",
  "عايز أجدد الرخصة",
];

export default function LandingSearchBox() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleExample = (text: string) => {
    router.push(`/search?q=${encodeURIComponent(text)}`);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="اكتب اللي عايز تعمله... مثل: البطاقة ضاعت"
          className="w-full px-6 py-4 pr-14 rounded-2xl border-2 border-sand-200 bg-white text-base focus:outline-none focus:border-pharaoh-gold focus:ring-4 focus:ring-pharaoh-gold/10 transition-all shadow-sm"
        />
        <button
          type="submit"
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-gradient-to-br from-pharaoh-gold-dark to-pharaoh-gold flex items-center justify-center text-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          aria-label="بحث"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      </form>

      <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
        <span className="text-gray-500">جرب:</span>
        {EXAMPLES.map((text) => (
          <button
            key={text}
            type="button"
            onClick={() => handleExample(text)}
            className="px-3 py-1 rounded-full bg-sand-100 hover:bg-sand-200 text-gray-700 transition-colors cursor-pointer"
          >
            {text}
          </button>
        ))}
      </div>
    </>
  );
}