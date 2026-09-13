import Link from "next/link";
import PharaohPattern from "../patterns/PharaohPattern";

const FOOTER_LINKS = {
    quick: [
    { href: "/", label: "الرئيسية" },
    { href: "/sectors", label: "القطاعات" },
    { href: "/services", label: "الخدمات" },
    { href: "/offices", label: "المصالح" },
    { href: "/hotlines", label: "الطوارئ" },
  ],
  legal: [
    { href: "/about", label: "عن الموقع" },
    { href: "/privacy", label: "سياسة الخصوصية" },
    { href: "/terms", label: "الشروط" },
    { href: "/contact", label: "اتصل بنا" },
  ],
};

export default function Footer() {
  return (
    <footer className="mt-16 bg-gradient-to-b from-white to-sand-50 border-t border-sand-200">
      <div className="h-1 flex">
        <div className="flex-1 bg-egypt-red" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-egypt-black" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pharaoh-gold-light via-pharaoh-gold to-pharaoh-gold-dark flex items-center justify-center shadow-md">
                <span className="text-xl">𓀀</span>
              </div>
              <div className="font-display font-bold text-xl bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">
                مساعد مصر
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed max-w-md">
              منصة تبسيط وتجميع المعلومات الحكومية للمواطن المصري.
            </p>
            <p className="text-xs text-gray-500 mt-3">
              لسنا جهة حكومية. كل المعلومات موثقة من مصادر رسمية.
            </p>
          </div>

          <div>
            <h3 className="font-display font-bold text-egypt-black mb-3">
              روابط سريعة
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.quick.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-egypt-red transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-egypt-black mb-3">
              معلومات
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-egypt-red transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <PharaohPattern className="mt-10 mb-6 opacity-30" height={20} />

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div>
            © 2026 <span className="font-semibold text-egypt-black">مساعد مصر</span> — جميع الحقوق محفوظة
          </div>
          <div className="flex items-center gap-1.5">
            <span>صُنع بـ</span>
            <span className="text-pharaoh-gold text-base">𓀀</span>
            <span>في مصر</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
