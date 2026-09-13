import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PharaohPattern from "@/components/patterns/PharaohPattern";

export default function PrivacyPage() {
  const sections = [
    {
      title: "المعلومات التي نجمعها",
      content:
        "نجمع الحد الأدنى من المعلومات: البريد الإلكتروني والاسم عند التسجيل، بالإضافة إلى بيانات الاستخدام العامة (الصفحات الأكثر زيارة، البحث). لا نجمع بيانات حساسة أو معلومات شخصية غير ضرورية.",
    },
    {
      title: "كيف نستخدم معلوماتك",
      content:
        "نستخدم معلوماتك لتحسين تجربتك، إدارة حسابك، وإرسال تحديثات مهمة (إن اشتركت). لا نبيع أو نشارك معلوماتك مع أطراف ثالثة لأغراض تجارية.",
    },
    {
      title: "الكوكيز (Cookies)",
      content:
        "نستخدم الكوكيز لتذكر جلستك وحفظ التفضيلات. يمكنك تعطيلها من إعدادات المتصفح، لكن قد يؤثر على تجربتك.",
    },
    {
      title: "الإعلانات",
      content:
        "قد نعرض إعلانات من شبكات إعلانية (مثل Google AdSense) لتمويل تشغيل الموقع. هذه الشبكات قد تستخدم كوكيز لعرض إعلانات ملائمة. يمكنك التحكم في تفضيلات الإعلانات من إعدادات Google.",
    },
    {
      title: "الأمان",
      content:
        "نستخدم تشفير bcrypt لكلمات المرور و JWT للجلسات. جميع البيانات محمية، ونتبع أفضل الممارسات الأمنية.",
    },
    {
      title: "حقوقك",
      content:
        "لك الحق في: الوصول لبياناتك، تصحيحها، أو حذف حسابك بالكامل. للتواصل، استخدم صفحة اتصل بنا.",
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
            <div className="text-5xl mb-4">🔒</div>
            <h1 className="text-3xl md:text-5xl font-display font-extrabold mb-3">
              <span className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">
                سياسة الخصوصية
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