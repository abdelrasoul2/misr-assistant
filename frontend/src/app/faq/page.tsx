"use client";

import Link from "next/link";
import { useState } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PharaohPattern from "@/components/patterns/PharaohPattern";

interface FAQItem { q: string; a: string; }

const FAQS: FAQItem[] = [
  { q: "هل مساعد مصر جهة حكومية؟", a: "لا. مساعد مصر منصة مستقلة لتجميع وتبسيط المعلومات الحكومية. لسنا جهة حكومية ولا نقدم خدمات حكومية مباشرة. كل معلوماتنا موثقة من مصادر رسمية مع ذكر الرابط." },
  { q: "هل المعلومات دقيقة ومحدثة؟", a: "نسعى دائماً لتوفير معلومات دقيقة من مصادر رسمية. لكن الرسوم والمواعيد والمستندات قد تتغير. لذلك كل معلومة لها تاريخ آخر تحقق + رابط للمصدر الرسمي." },
  { q: "كيف أبحث عن خدمة؟", a: "اكتب سؤالك بالعامية في مربع البحث — مثلاً: \"بطاقتي ضاعت\"، \"عايز أطلع جواز\"، \"عايز أجدد الرخصة\". المنصة تفهم لغتك وتعرض لك الخدمة المناسبة." },
  { q: "إيه الفرق بين البحث العادي والمساعد الذكي؟", a: "البحث العادي يعرض لك قائمة خدمات مباشرة. المساعد الذكي (🤖) يقدر يجاوب على أسئلة معقدة ويكتبلك شرح مخصص، ويجاوب على أسئلة متتالية في نفس المحادثة." },
  { q: "المساعد الذكي بيخترع معلومات؟", a: "لا. المساعد يعتمد فقط على المعلومات الموجودة في قاعدة بياناتنا الموثقة. لو مالقاش معلومة، يقولك يتحقق من المصدر الرسمي بدل ما يخترع." },
  { q: "هل يمكنني حفظ متابعة طلبي؟", a: "نعم. عند فتح أي خدمة، قائمة المستندات المطلوبة interactive — علّم على كل ورقة جهزتها، والمتصفح يحفظها لك." },
  { q: "الموقع مجاني؟", a: "نعم، استخدام الموقع مجاني بالكامل. قد نعرض إعلانات لتغطية تكاليف التشغيل، لكن المحتوى الأساسي مجاني دائماً." },
  { q: "كيف أبلغ عن معلومة غلط؟", a: "من صفحة \"اتصل بنا\" — ابعتلنا تفاصيل المعلومة والمصدر الصح. نسعى لمراجعة كل تقرير في أسرع وقت." },
  { q: "هل توجد خدمة تنبيهات؟", a: "قيد التطوير. هنعمل خدمة تنبيهك عند تحديث معلومة مهمة (مثلاً تغير رسوم خدمة معينة)." },
  { q: "إيه أفضل طريقة للاستخدام؟", a: "ابدأ من المساعد الذكي 🤖 أو البحث، لو احتجت تفاصيل كاملة افتح صفحة الخدمة، وعلّم على ورقك هناك." },
];

function FAQAccordion({ item, index }: { item: FAQItem; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden transition-all hover:border-pharaoh-gold/30">
      <button type="button" onClick={() => setOpen(!open)} className="w-full text-right px-5 py-4 flex items-start gap-4 hover:bg-sand-50 transition-colors">
        <span className="w-7 h-7 rounded-full bg-gradient-to-br from-pharaoh-gold to-pharaoh-gold-dark text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{index + 1}</span>
        <span className="flex-1 font-display font-bold text-egypt-black text-base leading-tight pt-0.5">{item.q}</span>
        <span className={"text-pharaoh-gold text-xl shrink-0 transition-transform duration-300 " + (open ? "rotate-180" : "")}>▾</span>
      </button>
      {open && (
        <div className="px-5 pb-5 pt-0 text-gray-700 text-sm leading-relaxed border-t border-sand-100 mt-1">
          <div className="pt-4">{item.a}</div>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
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
          <div className="max-w-3xl mx-auto px-4 py-16 relative text-center">
            <div className="text-5xl mb-4">❓</div>
            <h1 className="text-3xl md:text-5xl font-display font-extrabold mb-3">
              <span className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">
                الأسئلة الشائعة
              </span>
            </h1>
            <p className="text-gray-600 max-w-xl mx-auto">كل اللي عايز تعرفه عن مساعد مصر</p>
            <PharaohPattern className="opacity-30 max-w-md mx-auto mt-6" height={20} />
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 py-12 space-y-3">
          {FAQS.map((item, i) => (
            <FAQAccordion key={i} item={item} index={i} />
          ))}
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16 text-center">
          <div className="bg-gradient-to-br from-pharaoh-gold/10 to-white rounded-2xl border border-pharaoh-gold/30 p-8">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-display font-bold text-xl text-egypt-black mb-2">عندك سؤال تاني؟</h3>
            <p className="text-sm text-gray-600 mb-6">اسأل مساعد مصر الذكي أو اتصل بنا</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/assistant" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-l from-egypt-red-dark to-egypt-red text-white font-bold shadow-sm hover:shadow-md transition-all">
                <span>🤖</span><span>المساعد الذكي</span>
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-sand-200 text-gray-700 font-bold hover:border-pharaoh-gold/50 transition-all">
                <span>📬</span><span>اتصل بنا</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}