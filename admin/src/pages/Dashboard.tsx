export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">لوحة القيادة</h1>
        <p className="text-gray-500 mt-1">نظرة عامة على النظام</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-sm text-gray-500 mb-1">التصنيفات</div>
          <div className="text-3xl font-bold text-brand-700">—</div>
          <div className="text-xs text-gray-400 mt-2">قريباً</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-sm text-gray-500 mb-1">المصادر</div>
          <div className="text-3xl font-bold text-brand-700">—</div>
          <div className="text-xs text-gray-400 mt-2">قريباً</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-sm text-gray-500 mb-1">الخدمات</div>
          <div className="text-3xl font-bold text-brand-700">—</div>
          <div className="text-xs text-gray-400 mt-2">STEP 6.5</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-3">الخطوات القادمة</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>✅ STEP 6A — مشروع Vite + React + TypeScript</li>
          <li>✅ STEP 6B — Tailwind + Router + Query + Axios</li>
          <li>✅ STEP 6C — Tailwind + RTL + Arabic UI</li>
          <li>🔄 STEP 6D — Layout + Navigation (الآن)</li>
          <li>⏳ STEP 6E — Categories CRUD (واجهة كاملة)</li>
          <li>⏳ STEP 6F — Sources CRUD (واجهة كاملة)</li>
        </ul>
      </div>
    </div>
  );
}