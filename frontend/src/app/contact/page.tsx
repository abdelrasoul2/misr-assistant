import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PharaohPattern from "@/components/patterns/PharaohPattern";

export default function ContactPage() {
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
          <div className="max-w-4xl mx-auto px-4 py-16 relative text-center">
            <div className="text-5xl mb-4">📬</div>
            <h1 className="text-3xl md:text-5xl font-display font-extrabold mb-3">
              <span className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">
                اتصل بنا
              </span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              عندك سؤال؟ اقتراح؟ أو لقيت معلومة غلط؟
            </p>
            <PharaohPattern className="opacity-30 max-w-md mx-auto mt-6" height={20} />
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: "📧", title: "الإيميل", value: "info@misr-assistant.com", dir: "ltr" },
              { icon: "💬", title: "واتساب", value: "+20 XXX XXX XXXX", dir: "ltr" },
              { icon: "📱", title: "فيسبوك", value: "MisrAssistant", dir: "ltr" },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-2xl border border-sand-200 p-6 text-center hover:border-pharaoh-gold/50 transition-colors">
                <div className="text-4xl mb-3">{c.icon}</div>
                <div className="text-sm text-gray-500 mb-1">{c.title}</div>
                <div className="font-mono text-sm text-egypt-black break-all" dir={c.dir}>
                  {c.value}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl border border-sand-200 p-8">
            <h2 className="text-xl font-display font-bold text-egypt-black mb-6">
              أرسل رسالة
            </h2>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-egypt-black mb-1.5">
                    الاسم
                  </label>
                  <input
                    type="text"
                    placeholder="اسمك الكامل"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-sand-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pharaoh-gold/40 focus:border-pharaoh-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-egypt-black mb-1.5">
                    الإيميل
                  </label>
                  <input
                    type="email"
                    placeholder="example@misr.com"
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-sand-300 bg-white text-sm text-left focus:outline-none focus:ring-2 focus:ring-pharaoh-gold/40 focus:border-pharaoh-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-egypt-black mb-1.5">
                  الموضوع
                </label>
                <input
                  type="text"
                  placeholder="اقتراح / استفسار / تصحيح معلومة..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-sand-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pharaoh-gold/40 focus:border-pharaoh-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-egypt-black mb-1.5">
                  الرسالة
                </label>
                <textarea
                  rows={5}
                  placeholder="اكتب رسالتك هنا..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-sand-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pharaoh-gold/40 focus:border-pharaoh-gold resize-y"
                />
              </div>

              <div className="bg-sand-50 rounded-lg border border-sand-200 p-4 text-sm text-gray-500 flex items-start gap-2">
                <span className="text-lg leading-none">ℹ️</span>
                <span>
                  نموذج التواصل قيد التطوير. للاستفسارات العاجلة، استخدم الإيميل مباشرة.
                </span>
              </div>

              <button
                type="button"
                disabled
                className="w-full py-3 rounded-lg bg-gradient-to-l from-pharaoh-gold-dark to-pharaoh-gold text-white font-bold shadow-sm opacity-60 cursor-not-allowed"
              >
                إرسال (قريباً)
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}