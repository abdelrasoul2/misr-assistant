import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PharaohPattern from "@/components/patterns/PharaohPattern";

const STEPS = [
  { num: 1, icon: "🔍", title: "ابحث بلغتك", desc: "اكتب اللي انت عايزه بالعامية — مثل: \"بطاقتي ضاعت\"، \"عايز أطلع جواز\". المنصة تفهمك." },
  { num: 2, icon: "📄", title: "شوف الخدمة المناسبة", desc: "المنصة تعرض لك الخدمة الحكومية الصح مع الوصف الكامل والمستندات المطلوبة والرسوم." },
  { num: 3, icon: "✅", title: "اعرف ورقك", desc: "قائمة تفاعلية بالمستندات — علّم على كل ورقة جهزتها، والمتصفح يحفظها لك." },
  { num: 4, icon: "📍", title: "روح المكان الصح", desc: "اعرف عنوان المكتب، مواعيد العمل، والتليفون — وكل حاجة موثقة من المصدر الرسمي." },
];

const FEATURES = [
  { icon: "✨", title: "بحث ذكي بمدعوم AI", desc: "يفهم العامية المصرية والأخطاء الإملائية — ويكتبلك شرح مخصص لكل استفسار." },
  { icon: "🔒", title: "مصادر موثقة", desc: "كل معلومة لها مصدر رسمي وتاريخ آخر تحقق." },
  { icon: "🗺️", title: "أماكن + مواعيد", desc: "عناوين المصالح الحكومية مع خريطة تفاعلية ومواعيد العمل." },
  { icon: "🚨", title: "أرقام الطوارئ", desc: "25+ رقم طوارئ في مكان واحد — اضغط للاتصال مباشرة." },
];

export default function HowItWorksPage() {
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
          <div className="max-w-4xl mx-auto px-4 py-16 relative text-center">
            <div className="text-5xl mb-4">💡</div>
            <h1 className="text-3xl md:text-5xl font-display font-extrabold mb-3">
              <span className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">
                كيف يعمل الموقع؟
              </span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">في 4 خطوات بسيطة — من السؤال للتطبيق</p>
            <PharaohPattern className="opacity-30 max-w-md mx-auto mt-6" height={20} />
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STEPS.map((step) => (
              <div key={step.num} className="relative bg-white rounded-2xl border border-sand-200 p-6 hover:border-pharaoh-gold/50 hover:shadow-lg transition-all">
                <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-gradient-to-br from-pharaoh-gold to-pharaoh-gold-dark text-white flex items-center justify-center font-bold text-sm shadow-sm">{step.num}</div>
                <div className="text-4xl mb-4 pr-12">{step.icon}</div>
                <h3 className="font-display font-bold text-xl text-egypt-black mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-l from-sand-100 via-sand-50 to-white py-16 border-y border-sand-200">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-extrabold text-egypt-black mb-2">مميزات المنصة</h2>
              <p className="text-gray-600">كل حاجة محتاجها في مكان واحد</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FEATURES.map((f) => (
                <div key={f.title} className="bg-white rounded-2xl border border-sand-200 p-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pharaoh-gold-light via-pharaoh-gold to-pharaoh-gold-dark flex items-center justify-center text-3xl mb-4">{f.icon}</div>
                  <h3 className="font-display font-bold text-lg text-egypt-black mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-extrabold mb-4">جاهز تجرب؟</h2>
          <p className="text-gray-600 mb-8">ابحث عن أول خدمة، أو اسأل المساعد الذكي</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/search" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-l from-egypt-red-dark to-egypt-red text-white font-bold shadow-lg hover:shadow-xl transition-all">
              <span>🔍</span><span>ابدأ البحث</span>
            </Link>
            <Link href="/assistant" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white border-2 border-pharaoh-gold/40 text-egypt-black font-bold hover:border-pharaoh-gold transition-all">
              <span>🤖</span><span>اسأل المساعد</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}