import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PharaohPattern from "@/components/patterns/PharaohPattern";

export default function AboutPage() {
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
              𓊹
            </div>
          </div>
          <div className="max-w-4xl mx-auto px-4 py-16 relative text-center">
            <div className="text-5xl mb-4">𓀀</div>
            <h1 className="text-3xl md:text-5xl font-display font-extrabold mb-3">
              <span className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">
                عن مساعد مصر
              </span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              منصة تبسيط وتجميع المعلومات الحكومية للمواطن المصري
            </p>
            <PharaohPattern className="opacity-30 max-w-md mx-auto mt-6" height={20} />
          </div>
        </section>

        {/* Content */}
        <section className="max-w-4xl mx-auto px-4 py-16 space-y-8">
          {/* Mission */}
          <div className="bg-white rounded-2xl border border-sand-200 p-8">
            <h2 className="text-2xl font-display font-extrabold text-egypt-black mb-4 flex items-center gap-3">
              <span className="text-pharaoh-gold">◆</span>
              رسالتنا
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              نبني منصة تجمع المعلومات الحكومية الرسمية وتبسطها للمواطن المصري.
              المستخدم لا يحتاج معرفة الاسم الرسمي للخدمة — يكتب ما يريد بلغته،
              ونحن نوضح له الخطوات والمستندات والرسوم والأماكن.
            </p>
            <p className="text-gray-700 leading-relaxed">
              هدفنا: <strong className="text-egypt-red">أفهم الخدمة في أقل وقت، بدون تعقيد.</strong>
            </p>
          </div>

          {/* Our Principles */}
          <div className="bg-white rounded-2xl border border-sand-200 p-8">
            <h2 className="text-2xl font-display font-extrabold text-egypt-black mb-6 flex items-center gap-3">
              <span className="text-pharaoh-gold">◆</span>
              مبادئنا
            </h2>
            <div className="space-y-4">
              {[
                { icon: "✓", title: "المصادر الرسمية أولاً", desc: "كل معلومة لها مصدر رسمي ورابط وتاريخ آخر تحقق." },
                { icon: "✓", title: "شفافية كاملة", desc: "لسنا جهة حكومية. نوضح ذلك دائماً للمستخدم." },
                { icon: "✓", title: "لا نخترع معلومات", desc: "إذا لم نجد مصدراً رسمياً، لا نعرض المعلومة كمؤكدة." },
                { icon: "✓", title: "المستخدم أولاً", desc: "تصميم بسيط، سريع، بدون تسجيل إجباري." },
              ].map((p, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold shrink-0 border border-green-200">
                    {p.icon}
                  </div>
                  <div>
                    <div className="font-bold text-egypt-black mb-1">{p.title}</div>
                    <div className="text-sm text-gray-600">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-red-50 rounded-2xl border border-red-200 p-8">
            <h2 className="text-2xl font-display font-extrabold text-egypt-red-dark mb-4 flex items-center gap-3">
              <span>⚠️</span>
              إخلاء مسؤولية
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>لسنا جهة حكومية.</strong> نحن منصة معلومات مستقلة.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              كل المعلومات المعروضة موثقة من مصادر رسمية، لكن الرسوم والمواعيد والمستندات قد تتغير.
              يجب دائماً التحقق من المصدر الرسمي قبل الشروع في أي معاملة.
            </p>
            <p className="text-gray-700 leading-relaxed">
              لا نتحمل مسؤولية أي قرارات تُبنى على المعلومات المعروضة.
            </p>
          </div>

          {/* Roadmap */}
          <div className="bg-white rounded-2xl border border-sand-200 p-8">
            <h2 className="text-2xl font-display font-extrabold text-egypt-black mb-6 flex items-center gap-3">
              <span className="text-pharaoh-gold">◆</span>
              خريطة الطريق
            </h2>
            <div className="space-y-3">
              {[
                { status: "done", text: "القطاعات الحكومية (12 قطاع)" },
                { status: "done", text: "المصالح الحكومية (28 مكتب) + خريطة تفاعلية" },
                { status: "done", text: "أرقام الطوارئ (25 خط)" },
                { status: "done", text: "الحساب الشخصي (JWT Auth)" },
                { status: "active", text: "20+ خدمة حكومية كاملة" },
                { status: "pending", text: "مساعد AI يفهم العامية" },
                { status: "pending", text: "حفظ Checklists ومشاركتها" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span
                    className={[
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                      item.status === "done"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : item.status === "active"
                        ? "bg-pharaoh-gold/20 text-pharaoh-gold-dark border border-pharaoh-gold/40 ring-2 ring-pharaoh-gold/30"
                        : "bg-sand-100 text-gray-400 border border-sand-200",
                    ].join(" ")}
                  >
                    {item.status === "done" ? "✓" : item.status === "active" ? "◉" : "○"}
                  </span>
                  <span
                    className={
                      item.status === "done"
                        ? "text-gray-500 line-through"
                        : item.status === "active"
                        ? "text-egypt-black font-semibold"
                        : "text-gray-600"
                    }
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-l from-egypt-red-dark to-egypt-red text-white font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <span>اتصل بنا</span>
              <span>←</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}