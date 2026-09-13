"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !password) {
      setError("من فضلك املأ كل الحقول");
      return;
    }

    if (fullName.trim().length < 2) {
      setError("الاسم قصير جداً");
      return;
    }

    if (password.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    setLoading(true);
    try {
      await register({
        email: email.trim(),
        full_name: fullName.trim(),
        password,
      });
      router.push("/dashboard");
    } catch (err: unknown) {
      const anyErr = err as {
        response?: { status?: number; data?: { detail?: string } };
      };
      if (anyErr.response?.status === 409) {
        setError("هذا البريد الإلكتروني مسجل بالفعل");
      } else if (anyErr.response?.data?.detail) {
        setError(anyErr.response.data.detail);
      } else {
        setError("حدث خطأ، حاول مرة أخرى");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-sand-50 to-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block text-5xl mb-3">𓀀</div>
            <h1 className="text-3xl font-display font-extrabold mb-2">
              <span className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">
                إنشاء حساب جديد
              </span>
            </h1>
            <p className="text-gray-500 text-sm">
              انضم لمئات المستخدمين في مساعد مصر
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-sand-200 shadow-lg p-8">
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
                <span className="text-lg leading-none">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-egypt-black mb-1.5">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="أحمد محمد"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-sand-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pharaoh-gold/40 focus:border-pharaoh-gold transition-all"
                  autoComplete="name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-egypt-black mb-1.5">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@misr.com"
                  dir="ltr"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-sand-300 bg-white text-sm text-left focus:outline-none focus:ring-2 focus:ring-pharaoh-gold/40 focus:border-pharaoh-gold transition-all"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-egypt-black mb-1.5">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8 أحرف على الأقل"
                  dir="ltr"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-sand-300 bg-white text-sm text-left focus:outline-none focus:ring-2 focus:ring-pharaoh-gold/40 focus:border-pharaoh-gold transition-all"
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-egypt-black mb-1.5">
                  تأكيد كلمة المرور
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  dir="ltr"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-sand-300 bg-white text-sm text-left focus:outline-none focus:ring-2 focus:ring-pharaoh-gold/40 focus:border-pharaoh-gold transition-all"
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-l from-pharaoh-gold-dark via-pharaoh-gold to-pharaoh-gold-light text-egypt-black font-bold shadow-md hover:shadow-lg hover:brightness-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed border border-pharaoh-gold-dark/20"
              >
                {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-sand-100 text-center">
              <p className="text-sm text-gray-600">
                لديك حساب بالفعل؟{" "}
                <Link
                  href="/login"
                  className="font-semibold text-egypt-red hover:text-egypt-red-dark"
                >
                  سجّل دخول
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-400">
            🔒 معلوماتك محمية بتشفير JWT + bcrypt
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}