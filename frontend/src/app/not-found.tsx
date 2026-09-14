import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PharaohPattern from "@/components/patterns/PharaohPattern";

const QUICK_LINKS = [
  { href: "/", label: "الرئيسية", icon: "🏠" },
  { href: "/services", label: "الخدمات", icon: "📄" },
  { href: "/sectors", label: "القطاعات", icon: "⚖️" },
  { href: "/offices", label: "المصالح", icon: "📍" },
  { href: "/hotlines", label: "الطوارئ", icon: "🚨" },
  { href: "/search", label: "ابحث", icon: "🔍" },
];

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-sand-50 to-white flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center">
          {/* Animated 404 */}
          <div className="relative mb-8">
            <div className="text-[120px] md:text-[180px] font-display font-extrabold leading-none bg-gradient-to-b from-egypt-red/20 to-pharaoh-gold/20 bg-clip-text text-transparent select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-7xl md:text-8xl float-anim">🏺</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-display font-extrabold mb-4">
            <span className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">
              الصفحة غير موجودة
            </span>
          </h1>

          <p className="text-gray-600 max-w-md mx-auto mb-3 leading-relaxed">
            عذراً، الصفحة اللي بتدور عليها مش موجودة أو اتنقلت لمكان تاني.
          </p>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-8">
            تأكد من الرابط، أو ابدأ من الصفحة الرئيسية، أو اسأل{" "}
            <span className="font-bold text-egypt-red">مساعد مصر الذكي</span>{" "}
            🤖
          </p>

          <PharaohPattern className="opacity-30 max-w-md mx-auto mb-8" height={20} />

          {/* Quick links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-sand-200 hover:border-pharaoh-gold/50 hover:shadow-md transition-all"
              >
                <span className="text-xl">{link.icon}</span>
                <span className="text-sm font-semibold text-egypt-black group-hover:text-egypt-red transition-colors">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-l from-egypt-red-dark to-egypt-red text-white font-bold shadow-lg hover:shadow-xl transition-all"
          >
            <span>←</span>
            <span>العودة للرئيسية</span>
          </Link>

          {/* FAB hint */}
          <div className="mt-10 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-pharaoh-gold/10 border border-pharaoh-gold/30">
            <span className="text-lg">💡</span>
            <span className="text-xs text-pharaoh-gold-dark font-medium">
              جرّب زر 🤖 في الأسفل للتواصل مع المساعد الذكي
            </span>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}