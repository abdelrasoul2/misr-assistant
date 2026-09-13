"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "الرئيسية" },
  { href: "/services", label: "الخدمات" },
  { href: "/offices", label: "المصالح" },
  { href: "/hotlines", label: "الطوارئ" },
  { href: "/about", label: "عن الموقع" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-sand-200">
      <div className="h-1 flex">
        <div className="flex-1 bg-egypt-red" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-egypt-black" />
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pharaoh-gold-light via-pharaoh-gold to-pharaoh-gold-dark flex items-center justify-center shadow-md float-anim">
              <span className="text-xl">𓀀</span>
            </div>
            <div>
              <div className="font-display font-bold text-lg leading-tight bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">
                مساعد مصر
              </div>
              <div className="text-[10px] text-gray-500 font-medium">
                Smart Government Assistant
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-sand-100 hover:text-egypt-red transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-sand-100 transition-colors"
            >
              دخول
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-l from-pharaoh-gold-dark via-pharaoh-gold to-pharaoh-gold-light text-egypt-black shadow-sm hover:shadow-md hover:brightness-105 transition-all border border-pharaoh-gold-dark/20"
            >
              ابدأ الآن
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 rounded-lg hover:bg-sand-100 flex items-center justify-center"
            aria-label="menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-sand-200 bg-white">
          <nav className="px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-sand-100"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-sand-200 flex gap-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-sand-100"
              >
                دخول
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center px-4 py-2 rounded-lg text-sm font-semibold bg-pharaoh-gold text-egypt-black"
              >
                ابدأ الآن
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
