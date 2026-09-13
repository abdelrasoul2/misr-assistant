import { useState } from "react";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import PharaohPattern from "../components/patterns/PharaohPattern";
import { useGovernorates } from "../features/governorates/hooks";

const REGIONS = [
  "الكل",
  "القاهرة الكبرى",
  "الإسكندرية",
  "الدلتا",
  "القناة",
  "سيناء",
  "الصعيد",
  "الحدود",
];

export default function Governorates() {
  const [region, setRegion] = useState("الكل");
  const params = region === "الكل" ? {} : { region };
  const { data, isLoading, isError } = useGovernorates({
    page: 1,
    page_size: 100,
    ...params,
  });

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-sand-100 via-sand-50 to-white border border-pharaoh-gold/30">
        <div className="h-1 flex">
          <div className="flex-1 bg-egypt-red" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-egypt-black" />
        </div>
        <div className="relative px-6 py-6 flex items-center gap-4">
          <span className="text-3xl">🗺️</span>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold">
              <span className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">
                المحافطات
              </span>
            </h1>
            <p className="text-sm text-gray-600 mt-0.5">
              27 محافطة مصرية
            </p>
          </div>
        </div>
        <PharaohPattern className="opacity-25" height={16} />
      </div>

      <div className="flex items-center gap-2 flex-wrap bg-white rounded-xl border border-sand-200 p-2">
        {REGIONS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRegion(r)}
            className={[
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              region === r
                ? "bg-gradient-to-l from-pharaoh-gold-light to-pharaoh-gold/50 text-egypt-black shadow-sm"
                : "text-gray-600 hover:bg-sand-50",
            ].join(" ")}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden shadow-sm">
        {isLoading && <Spinner size="lg" />}

        {isError && (
          <div className="p-6 text-center text-egypt-red">
            <div className="text-3xl mb-2">⚠️</div>
            <div className="font-semibold">حدث خطأ في تحميل البيانات</div>
          </div>
        )}

        {!isLoading && !isError && data && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-l from-sand-100 to-sand-50 border-b border-sand-200 text-gray-700">
                  <th className="px-4 py-3.5 text-right font-bold w-16">#</th>
                  <th className="px-4 py-3.5 text-right font-bold">الاسم</th>
                  <th className="px-4 py-3.5 text-right font-bold">Code</th>
                  <th className="px-4 py-3.5 text-right font-bold">English</th>
                  <th className="px-4 py-3.5 text-right font-bold">المنطقة</th>
                  <th className="px-4 py-3.5 text-right font-bold">الإحداثيات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {data.items.map((g) => (
                  <tr key={g.id} className="hover:bg-sand-50/60 transition-colors">
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                      {g.id}
                    </td>
                    <td className="px-4 py-3 font-semibold text-egypt-black">
                      {g.name_ar}
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs bg-sand-100 px-2 py-1 rounded-md text-gray-700 border border-sand-200">
                        {g.code}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs" dir="ltr">
                      {g.name_en}
                    </td>
                    <td className="px-4 py-3">
                      <Badge color="gold">{g.region}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs font-mono" dir="ltr">
                      {g.latitude && g.longitude
                        ? parseFloat(g.latitude).toFixed(2) + ", " + parseFloat(g.longitude).toFixed(2)
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {data && (
        <div className="text-sm text-gray-600 text-center">
          إجمالي <strong>{data.total}</strong> محافظة
        </div>
      )}
    </div>
  );
}
