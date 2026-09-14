import Link from "next/link";
import LandingSearchBox from "@/components/home/LandingSearchBox";
import AdBanner from "@/components/ads/AdBanner";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PharaohPattern from "@/components/patterns/PharaohPattern";

const SECTORS = [
  { slug: "emergency", name: "الطوارئ", icon: "🚨", color: "#DC2626" },
  { slug: "justice", name: "القضاء", icon: "⚖️", color: "#1E40AF" },
  { slug: "interior", name: "الداخلية", icon: "🛡️", color: "#0F172A" },
  { slug: "health", name: "الصحة", icon: "🏥", color: "#059669" },
  { slug: "education", name: "التعليم", icon: "🎓", color: "#7C3AED" },
  { slug: "local-government", name: "الحكم المحلي", icon: "🏛️", color: "#0891B2" },
  { slug: "finance", name: "المالية", icon: "💰", color: "#CA8A04" },
  { slug: "housing", name: "الإسكان", icon: "🏗️", color: "#EA580C" },
  { slug: "agriculture", name: "الزراعة", icon: "🌾", color: "#65A30D" },
  { slug: "transport", name: "النقل", icon: "🚢", color: "#0284C7" },
  { slug: "manpower", name: "القوى العاملة", icon: "💼", color: "#B45309" },
  { slug: "notary", name: "الشهر العقاري", icon: "📄", color: "#4338CA" },
];

const HOTLINES = [
  { number: "122", name: "الشرطة", icon: "🚓" },
  { number: "123", name: "الإسعاف", icon: "🚑" },
  { number: "180", name: "المطافئ", icon: "🚒" },
  { number: "129", name: "الغاز", icon: "💨" },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pharaoh-gold/10 border border-pharaoh-gold/30 text-sm text-pharaoh-gold-dark font-semibold mb-6">
              <span>🇪🇬</span>
              <span>منصة مصرية</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-extrabold mb-6">
              <span className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">
                مساعد مصر
              </span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-700 mb-3 font-medium">
              دليلك للخدمات الحكومية المصرية
            </p>
            <p className="text-base md:text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
              اعرف المستندات، الخطوات، الرسوم، والأماكن في مكان واحد
            </p>
            <div className="max-w-2xl mx-auto">
              <LandingSearchBox />
            </div>
          </div>
        </section>
        <AdBanner />

        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold mb-3">
              <span className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">لماذا مساعد مصر؟</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-sand-200 p-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pharaoh-gold-light via-pharaoh-gold to-pharaoh-gold-dark flex items-center justify-center text-2xl mb-4">✓</div>
              <h3 className="font-display font-bold text-xl text-egypt-black mb-2">معلومات موثقة</h3>
              <p className="text-sm text-gray-600">كل معلومة موثقة من مصادر رسمية</p>
            </div>
            <div className="bg-white rounded-2xl border border-sand-200 p-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pharaoh-gold-light via-pharaoh-gold to-pharaoh-gold-dark flex items-center justify-center text-2xl mb-4">🔍</div>
              <h3 className="font-display font-bold text-xl text-egypt-black mb-2">بحث ذكي</h3>
              <p className="text-sm text-gray-600">اكتب بالعامية والمنصة يفهمك</p>
            </div>
            <div className="bg-white rounded-2xl border border-sand-200 p-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pharaoh-gold-light via-pharaoh-gold to-pharaoh-gold-dark flex items-center justify-center text-2xl mb-4">🚨</div>
              <h3 className="font-display font-bold text-xl text-egypt-black mb-2">أرقام الطوارئ</h3>
              <p className="text-sm text-gray-600">جميع أرقام الطوارئ في مكان واحد</p>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-l from-sand-100 via-sand-50 to-white py-12 border-y border-sand-200">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center"><div className="text-4xl md:text-5xl font-display font-extrabold text-egypt-red mb-1">27</div><div className="text-sm text-gray-600 font-medium">محافظة</div></div>
            <div className="text-center"><div className="text-4xl md:text-5xl font-display font-extrabold text-egypt-red mb-1">30</div><div className="text-sm text-gray-600 font-medium">جهة</div></div>
            <div className="text-center"><div className="text-4xl md:text-5xl font-display font-extrabold text-egypt-red mb-1">25</div><div className="text-sm text-gray-600 font-medium">خط طوارئ</div></div>
            <div className="text-center"><div className="text-4xl md:text-5xl font-display font-extrabold text-egypt-red mb-1">12</div><div className="text-sm text-gray-600 font-medium">قطاع</div></div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold mb-3">
              <span className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">القطاعات الحكومية</span>
            </h2>
            <p className="text-gray-600">اختر القطاع للبدء</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {SECTORS.map((s) => (
              <Link key={s.slug} href={"/sectors/" + s.slug} className="group relative bg-white rounded-2xl border border-sand-200 p-5 hover:border-pharaoh-gold/50 hover:shadow-lg transition-all overflow-hidden">
                <div className="absolute top-0 right-0 left-0 h-1" style={{ backgroundColor: s.color }} />
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3" style={{ backgroundColor: s.color + "20" }}>{s.icon}</div>
                <div className="font-semibold text-egypt-black text-sm">{s.name}</div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/sectors" className="inline-block px-6 py-2.5 rounded-lg bg-sand-100 hover:bg-sand-200 text-gray-700 font-medium text-sm">عرض الكل ←</Link>
          </div>
        </section>

        <section className="bg-gradient-to-l from-red-50 via-sand-50 to-white py-12 border-y border-egypt-red/20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-display font-extrabold mb-2 text-egypt-red-dark">🚨 أرقام الطوارئ</h2>
              <p className="text-sm text-gray-600">اتصل مباشرة من أي مكان</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {HOTLINES.map((h) => (
                <a key={h.number} href={"tel:" + h.number} className="bg-white rounded-2xl border border-egypt-red/30 p-5 text-center hover:shadow-lg hover:border-egypt-red transition-all">
                  <div className="text-3xl mb-2">{h.icon}</div>
                  <div className="text-2xl font-display font-extrabold text-egypt-red mb-1" dir="ltr">{h.number}</div>
                  <div className="text-sm text-gray-600">{h.name}</div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-20">
          <div className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark rounded-3xl p-10 md:p-16 text-center text-white shadow-xl">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold mb-4">ابدأ الآن</h2>
            <p className="text-lg mb-8 opacity-95 max-w-2xl mx-auto">سجل مجاناً واحصل على مميزات إضافية</p>
            <Link href="/register" className="inline-block px-8 py-4 bg-white text-egypt-red-dark font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all">ابدأ مجاناً →</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}