"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-pharaoh-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">جاري التحميل...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Redirect in progress
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-sand-50 to-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Welcome Hero */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-sand-100 via-sand-50 to-white border border-pharaoh-gold/30 mb-8">
            <div className="h-1 flex">
              <div className="flex-1 bg-egypt-red" />
              <div className="flex-1 bg-white" />
              <div className="flex-1 bg-egypt-black" />
            </div>
            <div className="relative px-6 py-8 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-egypt-red to-egypt-red-dark text-white flex items-center justify-center font-bold shadow-lg ring-4 ring-pharaoh-gold/30 text-2xl">
                {user.full_name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-extrabold mb-1">
                  <span className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">
                    أهلاً، {user.full_name}
                  </span>
                </h1>
                <p className="text-sm text-gray-500" dir="ltr">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <Link
              href="/hotlines"
              className="group bg-white rounded-2xl border border-sand-200 p-6 hover:border-pharaoh-gold/50 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-red-50 text-egypt-red flex items-center justify-center text-2xl mb-4">
                🚨
              </div>
              <h3 className="font-display font-bold text-lg mb-1">أرقام الطوارئ</h3>
              <p className="text-sm text-gray-500">كل أرقام الطوارئ في مكان واحد</p>
            </Link>

            <Link
              href="/offices"
              className="group bg-white rounded-2xl border border-sand-200 p-6 hover:border-pharaoh-gold/50 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-pharaoh-gold/10 text-pharaoh-gold-dark flex items-center justify-center text-2xl mb-4">
                📍
              </div>
              <h3 className="font-display font-bold text-lg mb-1">المصالح الحكومية</h3>
              <p className="text-sm text-gray-500">اعرف أقرب مكتب ليك</p>
            </Link>

            <Link
              href="/services"
              className="group bg-white rounded-2xl border border-sand-200 p-6 hover:border-pharaoh-gold/50 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-pharaoh-blue flex items-center justify-center text-2xl mb-4">
                📄
              </div>
              <h3 className="font-display font-bold text-lg mb-1">الخدمات</h3>
              <p className="text-sm text-gray-500">ابدأ بإنجاز معاملتك</p>
            </Link>
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-2xl border border-sand-200 p-6">
            <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
              <span className="text-pharaoh-gold">𓊪</span>
              معلومات الحساب
            </h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500 mb-1">الاسم الكامل</dt>
                <dd className="font-semibold text-egypt-black">{user.full_name}</dd>
              </div>
              <div>
                <dt className="text-gray-500 mb-1">البريد الإلكتروني</dt>
                <dd className="font-semibold text-egypt-black" dir="ltr">
                  {user.email}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 mb-1">معرّف الحساب</dt>
                <dd className="font-semibold text-egypt-black font-mono" dir="ltr">
                  #{user.id}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 mb-1">تاريخ التسجيل</dt>
                <dd className="font-semibold text-egypt-black">
                  {new Date(user.created_at).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 mb-1">حالة الحساب</dt>
                <dd>
                  {user.is_active ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      ✓ نشط
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                      معطّل
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {/* Coming Soon */}
          <div className="mt-8 bg-gradient-to-l from-sand-50 to-white rounded-2xl border border-dashed border-sand-300 p-8 text-center">
            <div className="text-4xl mb-3">🔮</div>
            <h3 className="font-display font-bold text-lg mb-1 text-egypt-black">
              قريباً...
            </h3>
            <p className="text-sm text-gray-500">
              حفظ Checklists, AI Assistant, Notifications, والمزيد
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}