import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PharaohPattern from "@/components/patterns/PharaohPattern";

export default function TermsPage() {
  const sections = [
    {
      title: "قبول الشروط",
      content:
        "باستخدامك مساعد مصر، فإنك توافق على هذه الشروط. إذا لم توافق، يُرجى عدم استخدام الموقع.",
    },
    {
      title: "طبيعة الخدمة",
      content:
        "مساعد مصر منصة معلومات مستقلة. لسنا جهة حكومية، ولا نقدم خدمات حكومية مباشرة. نعرض معلومات موثقة من مصادر رسمية لأغراض إرشادية فقط.",
    },
    {
      title: "دقة المعلومات",
      content:
        "نبذل قصارى جهدنا لتوفير معلومات دقيقة ومحدثة. لكن الرسوم والمواعيد والمستندات قد تتغير من وقت لآخر. يجب دائماً التحقق من المصادر الرسمية قبل الشروع في أي معاملة.",
    },
    {
      title: "حدود المسؤولية",
      content:
        "لا نتحمل أي مسؤولية عن أي أضرار مباشرة أو غير مباشرة تنشأ عن استخدام الموقع أو الاعتماد على المعلومات المعروضة.",
    },
    {
      title: "الملكية الفكرية",
      content:
        "المحتوى والتصميم والشعارات ملك لمساعد مصر. لا يجوز نسخ أو إعادة استخدام المحتوى دون إذن كتابي.",
    },
    {
      title: "التعديلات",
      content:
        "نحتفظ بالحق في تعديل هذه الشروط في أي وقت. التعديلات تسري فور نشرها على الموقع.",
    },
    {
      title: "القانون الواجب التطبيق",
      content:
        "تخضع هذه الشروط للقوانين المصرية. أي نزاع يُحل أمام المحاكم المصرية المختصة.",
    },
  ];

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
            <div className="text-5xl mb-4">📜</div>
            <h1 className="text-3xl md:text-5xl font-display font-extrabold mb-3">
              <span className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">
                شروط الاستخدام
              </span>
            </h1>
            <p className="text-gray-500 text-sm">
              آخر تحديث: سبتمبر 2026
            </p>
            <PharaohPattern className="opacity-30 max-w-md mx-auto mt-6" height={20} />
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 py-16">
          <div className="space-y-6">
            {sections.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-sand-200 p-6">
                <h2 className="text-lg font-display font-bold text-egypt-black mb-3 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-egypt-red/10 text-egypt-red flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  {s.title}
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm">{s.content}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}