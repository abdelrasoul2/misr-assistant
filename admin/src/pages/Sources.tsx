export default function Sources() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المصادر</h1>
          <p className="text-gray-500 mt-1">إدارة المصادر الرسمية</p>
        </div>
        <button
          type="button"
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors"
          disabled
        >
          + مصدر جديد
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
        قريباً — CRUD كامل للمصادر في STEP 6F
      </div>
    </div>
  );
}