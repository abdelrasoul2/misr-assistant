import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PharaohPattern from "@/components/patterns/PharaohPattern";

export default function ServicesPage() {
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

        {/* Content */}
        <section className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-3xl border-2 border-dashed border-pharaoh-gold/40 p-12 md:p-16">
            <div className="text-7xl mb-6">🔮</div>
            <h2 className="text-3xl font-display font-extrabold text-egypt-black mb-4">
              قريباً جداً
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              نعمل حالياً على إضافة <strong className="text-egypt-red">20+ خدمة حكومية</strong> شاملة:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10 text-right">
              {[
                "🪪 بطاقة الرقم القومي",
                "🛂 جواز السفر",
                "🚗 رخصة القيادة",
                "📄 صحيفة الحالة الجنائية",
                "⚖️ خدمات الشهر العقاري",
                "🎓 خدمات التعليم",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-sand-50 rounded-xl p-4 border border-sand-200"
                >
                  <span className="text-2xl">{item.split(" ")[0]}</span>
                  <span className="text-sm font-medium text-egypt-black">
                    {item.substring(item.indexOf(" ") + 1)}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500 mb-6">
              حتى ذلك الحين، يمكنك الاطلاع على:
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/sectors"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-l from-egypt-red-dark to-egypt-red text-white font-bold shadow-md hover:shadow-lg transition-all"
              >
                <span>⚖️</span>
                <span>القطاعات الحكومية</span>
              </Link>
              <Link
                href="/offices"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-pharaoh-gold/40 text-egypt-black font-bold hover:border-pharaoh-gold transition-all"
              >
                <span>📍</span>
                <span>المصالح الحكومية</span>
              </Link>
              <Link
                href="/hotlines"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-egypt-red/30 text-egypt-red-dark font-bold hover:border-egypt-red transition-all"
              >
                <span>🚨</span>
                <span>أرقام الطوارئ</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}