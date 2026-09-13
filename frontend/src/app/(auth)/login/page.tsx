"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("من فضلك املأ كل الحقول");
      return;
    }

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      router.push("/dashboard");
    } catch (err: unknown) {
      const anyErr = err as {
        response?: { status?: number; data?: { detail?: string } };
      };
      if (anyErr.response?.status === 401) {
        setError("الإيميل أو كلمة المرور غير صحيحة");
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
                تسجيل الدخول
              </span>
            </h1>
            <p className="text-gray-500 text-sm">
              أهلاً بك في مساعد مصر
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
                  placeholder="••••••••"
                  dir="ltr"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-sand-300 bg-white text-sm text-left focus:outline-none focus:ring-2 focus:ring-pharaoh-gold/40 focus:border-pharaoh-gold transition-all"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-l from-egypt-red-dark via-egypt-red to-egypt-red text-white font-bold shadow-md hover:shadow-lg hover:brightness-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "جاري تسجيل الدخول..." : "دخول"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-sand-100 text-center">
              <p className="text-sm text-gray-600">
                ليس لديك حساب؟{" "}
                <Link
                  href="/register"
                  className="font-semibold text-egypt-red hover:text-egypt-red-dark"
                >
                  أنشئ حساباً جديداً
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-400">
            🔒 معلوماتك محمية بتشفير JWT
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}