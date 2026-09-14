"use client";

import Link from "next/link";
import { use, useEffect, useState, type FormEvent } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PharaohPattern from "@/components/patterns/PharaohPattern";
import { useRequestData, useRequestProgress } from "@/features/request/hooks";
import { copyToClipboard, clearRequestData } from "@/features/request/store";
import { getFillGuide } from "@/features/request/templates";
import { EMPTY_REQUEST_DATA, type RequestData } from "@/features/request/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const FIELD_LABELS: Record<keyof RequestData, string> = {
  full_name: "الاسم الكامل",
  national_id: "الرقم القومي",
  address: "العنوان",
  phone: "رقم التليفون",
  email: "البريد الإلكتروني (اختياري)",
};

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all " +
        (copied
          ? "bg-green-100 text-green-700 border border-green-300"
          : "bg-white text-pharaoh-gold-dark border border-pharaoh-gold/40 hover:bg-pharaoh-gold/10")
      }
    >
      <span>{copied ? "✓" : "📋"}</span>
      <span>{copied ? "تم النسخ" : label}</span>
    </button>
  );
}

export default function RequestAssistantPage({ params }: PageProps) {
  const { slug } = use(params);
  const guide = getFillGuide(slug);

  const { data, update } = useRequestData();
  const { done, ready, toggle, reset } = useRequestProgress(slug);

  const [form, setForm] = useState<RequestData>(EMPTY_REQUEST_DATA);
  const [formLoaded, setFormLoaded] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  // Load saved data
  useEffect(() => {
    if (data) {
      setForm(data);
      setFormLoaded(true);
    }
  }, [data]);

  const updateField = (field: keyof RequestData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    update(form);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  const handleClear = () => {
    if (confirm("هل أنت متأكد من حذف بياناتك المحفوظة؟")) {
      clearRequestData();
      setForm(EMPTY_REQUEST_DATA);
    }
  };

  const dataReady =
    form.full_name.trim() &&
    form.national_id.trim() &&
    form.address.trim() &&
    form.phone.trim();

  // 404 state — no guide
  if (!guide) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">📝</div>
            <h1 className="text-2xl font-display font-bold text-egypt-black mb-2">
              الخدمة غير مدعومة
            </h1>
            <p className="text-gray-500 mb-6">
              خدمة الملء الآلي غير متاحة لهذه الخدمة حالياً. نعمل على إضافة المزيد قريباً.
            </p>
            <Link
              href={`/services/${slug}`}
              className="inline-block px-6 py-3 rounded-xl bg-gradient-to-l from-egypt-red-dark to-egypt-red text-white font-bold shadow-md hover:shadow-lg transition-all"
            >
              ← العودة لصفحة الخدمة
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const totalSteps = guide.steps.length;
  const doneCount = Array.from(done).filter((id) =>
    guide.steps.some((s) => s.id === id)
  ).length;

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
          <div className="max-w-4xl mx-auto px-4 py-10 relative">
            <Link
              href={`/services/${slug}`}
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-egypt-red mb-5 transition-colors"
            >
              <span>←</span>
              <span>العودة لصفحة الخدمة</span>
            </Link>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pharaoh-gold to-pharaoh-gold-dark flex items-center justify-center text-3xl shadow-md shrink-0">
                📝
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-extrabold mb-1">
                  <span className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">
                    مساعد ملء الطلب
                  </span>
                </h1>
                <p className="text-gray-600 text-sm">
                  {guide.service_name}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-4 flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div className="text-sm text-gray-700 leading-relaxed">
                <strong className="text-blue-700">كيف يعمل؟</strong> املأ بياناتك
                مرة واحدة، ثم سنرشدك خطوة بخطوة لملء الفورم الحكومي. اضغط{" "}
                <span className="font-bold">📋 انسخ</span> لكل حقل والصقه في الموقع الحكومي.
                <span className="block mt-1 text-xs text-gray-500">
                  🔒 بياناتك تُحفظ في متصفحك فقط — لا تُرسل لأي سيرفر.
                </span>
              </div>
            </div>

            <PharaohPattern className="opacity-20 mt-6" height={16} />
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
          {/* Step 1: Form */}
          <section className="bg-white rounded-2xl border border-sand-200 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-egypt-red to-egypt-red-dark text-white flex items-center justify-center font-bold text-sm shadow-sm">
                1
              </div>
              <h2 className="font-display font-bold text-lg text-egypt-black">
                بياناتك الشخصية
              </h2>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-egypt-black mb-1.5">
                    {FIELD_LABELS.full_name}
                  </label>
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={(e) => updateField("full_name", e.target.value)}
                    placeholder="محمد محمود أحمد"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-sand-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pharaoh-gold/40 focus:border-pharaoh-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-egypt-black mb-1.5">
                    {FIELD_LABELS.national_id}
                  </label>
                  <input
                    type="text"
                    value={form.national_id}
                    onChange={(e) => updateField("national_id", e.target.value)}
                    placeholder="30302041300012"
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-sand-300 bg-white text-sm text-left focus:outline-none focus:ring-2 focus:ring-pharaoh-gold/40 focus:border-pharaoh-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-egypt-black mb-1.5">
                    {FIELD_LABELS.phone}
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="01012345678"
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-sand-300 bg-white text-sm text-left focus:outline-none focus:ring-2 focus:ring-pharaoh-gold/40 focus:border-pharaoh-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-egypt-black mb-1.5">
                    {FIELD_LABELS.email}
                  </label>
                  <input
                    type="email"
                    value={form.email ?? ""}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="example@misr.com"
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-sand-300 bg-white text-sm text-left focus:outline-none focus:ring-2 focus:ring-pharaoh-gold/40 focus:border-pharaoh-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-egypt-black mb-1.5">
                  {FIELD_LABELS.address}
                </label>
                <textarea
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  rows={2}
                  placeholder="الشرقية - منيا القمح - شارع ..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-sand-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pharaoh-gold/40 focus:border-pharaoh-gold resize-y"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-l from-pharaoh-gold-dark to-pharaoh-gold text-egypt-black font-bold shadow-sm hover:shadow-md transition-all"
                >
                  <span>💾</span>
                  <span>احفظ البيانات</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-red-200 text-egypt-red font-bold text-sm hover:bg-red-50 transition-all"
                >
                  🗑️ امسح البيانات
                </button>
                {savedMessage && (
                  <span className="text-sm font-semibold text-green-600 inline-flex items-center gap-1">
                    <span>✓</span>
                    <span>تم الحفظ في متصفحك</span>
                  </span>
                )}
              </div>
            </form>
          </section>

          {/* Steps */}
          {dataReady && (
            <section className="bg-white rounded-2xl border border-sand-200 p-6">
              <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-egypt-red to-egypt-red-dark text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    2
                  </div>
                  <h2 className="font-display font-bold text-lg text-egypt-black">
                    اتبع الخطوات
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    {doneCount} / {totalSteps}
                  </span>
                  <button
                    type="button"
                    onClick={reset}
                    className="text-xs text-gray-500 hover:text-egypt-red transition-colors"
                  >
                    إعادة تعيين
                  </button>
                </div>
              </div>

              {/* Progress */}
              <div className="h-2 bg-sand-100 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-gradient-to-l from-green-500 to-green-600 transition-all duration-300"
                  style={{
                    width: `${(doneCount / totalSteps) * 100}%`,
                  }}
                />
              </div>

              <ol className="space-y-3">
                {guide.steps.map((step, index) => {
                  const isDone = done.has(step.id);
                  return (
                    <li
                      key={step.id}
                      className={
                        "rounded-xl border transition-all " +
                        (isDone
                          ? "bg-green-50/50 border-green-200"
                          : "bg-white border-sand-200")
                      }
                    >
                      <div className="p-4 flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => toggle(step.id)}
                          className={
                            "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-all " +
                            (isDone
                              ? "bg-green-500 text-white"
                              : "bg-sand-100 text-gray-500 hover:bg-sand-200")
                          }
                          aria-label={isDone ? "إلغاء" : "تم"}
                        >
                          {isDone ? "✓" : index + 1}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div
                            className={
                              "font-semibold text-sm " +
                              (isDone ? "line-through text-gray-400" : "text-egypt-black")
                            }
                          >
                            {step.title}
                          </div>
                          {step.instruction && (
                            <div className="text-xs text-gray-500 mt-1 leading-relaxed">
                              {step.instruction}
                            </div>
                          )}
                          {step.description && (
                            <div className="text-xs text-gray-500 mt-1">
                              {step.description}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            {step.copy_field && (
                              <CopyButton
                                text={form[step.copy_field] || ""}
                                label={
                                  step.copy_field === "full_name"
                                    ? "انسخ الاسم"
                                    : step.copy_field === "national_id"
                                    ? "انسخ الرقم القومي"
                                    : step.copy_field === "address"
                                    ? "انسخ العنوان"
                                    : step.copy_field === "phone"
                                    ? "انسخ التليفون"
                                    : "انسخ"
                                }
                              />
                            )}
                            {step.external_url && (
                              <a
                                href={step.external_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-l from-egypt-red-dark to-egypt-red text-white shadow-sm hover:shadow-md transition-all"
                              >
                                🔗 فتح الموقع
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          )}

          {/* Notes */}
          {dataReady && guide.notes && guide.notes.length > 0 && (
            <section className="bg-sand-50 rounded-2xl border border-sand-200 p-6">
              <h3 className="font-display font-bold text-base text-egypt-black mb-3 flex items-center gap-2">
                <span>📌</span>
                <span>ملاحظات مهمة</span>
              </h3>
              <ul className="space-y-2">
                {guide.notes.map((note, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-pharaoh-gold mt-0.5 shrink-0">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Disclaimer */}
          <div className="bg-red-50 rounded-2xl border border-red-200 p-5 flex items-start gap-3">
            <span className="text-2xl shrink-0">⚠️</span>
            <div className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-egypt-red-dark block mb-1">تنبيه:</strong>
              مساعد مصر لا يُرسل بياناتك لأي جهة. المساعد يساعدك في ملء الفورم الحكومي
              يدوياً (نسخ + لصق). تحقق دائماً من أنك على الموقع الرسمي قبل إدخال بياناتك.
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}