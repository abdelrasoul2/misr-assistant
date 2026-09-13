import { useState } from "react";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import PharaohPattern from "../components/patterns/PharaohPattern";
import {
  HOTLINE_TYPE_LABELS,
  type HotlineType,
} from "../features/hotlines/types";
import { useHotlines } from "../features/hotlines/hooks";

const HOTLINE_TYPES: { key: HotlineType | "all"; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "police", label: "شرطة" },
  { key: "ambulance", label: "إسعاف" },
  { key: "fire", label: "مطافئ" },
  { key: "gas", label: "غاز" },
  { key: "water", label: "مياه" },
  { key: "electricity", label: "كهرباء" },
  { key: "health", label: "صحة" },
  { key: "complaints", label: "شكاوى" },
];

export default function Hotlines() {
  const [htype, setHtype] = useState<HotlineType | "all">("all");

  const params: Record<string, unknown> = { page: 1, page_size: 200 };
  if (htype !== "all") params.hotline_type = htype;

  const { data, isLoading, isError } = useHotlines(params);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-red-50 via-sand-50 to-white border border-egypt-red/30">
        <div className="h-1 flex">
          <div className="flex-1 bg-egypt-red" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-egypt-black" />
        </div>
        <div className="relative px-6 py-6 flex items-center gap-4">
          <span className="text-3xl">🚨</span>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold">
              <span className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">
                أرقام الطوارئ
              </span>
            </h1>
            <p className="text-sm text-gray-600 mt-0.5">
              خطوط الطوارئ والخدمات العاجلة
            </p>
          </div>
        </div>
        <PharaohPattern className="opacity-25" height={16} />
      </div>

      <div className="flex items-center gap-2 flex-wrap bg-white rounded-xl border border-sand-200 p-2">
        <span className="text-xs text-gray-500 px-2 font-semibold">
          النوع:
        </span>
        {HOTLINE_TYPES.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setHtype(t.key)}
            className={[
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              htype === t.key
                ? "bg-gradient-to-l from-egypt-red/20 to-egypt-red/10 text-egypt-red-dark shadow-sm border border-egypt-red/30"
                : "text-gray-600 hover:bg-sand-50",
            ].join(" ")}
          >
            {t.label}
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
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-l from-red-50 to-sand-50 border-b border-egypt-red/20 text-gray-700">
                    <th className="px-4 py-3.5 text-right font-bold w-16">#</th>
                    <th className="px-4 py-3.5 text-right font-bold">الرقم</th>
                    <th className="px-4 py-3.5 text-right font-bold">الاسم</th>
                    <th className="px-4 py-3.5 text-right font-bold">النوع</th>
                    <th className="px-4 py-3.5 text-right font-bold">الوصف</th>
                    <th className="px-4 py-3.5 text-right font-bold">الأولوية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-100">
                  {data.items.map((h) => (
                    <tr key={h.id} className="hover:bg-red-50/40 transition-colors">
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                        {h.id}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={"tel:" + h.number}
                          className="inline-block px-3 py-1 rounded-lg bg-egypt-red text-white font-mono font-bold text-sm hover:bg-egypt-red-dark transition-colors"
                          dir="ltr"
                        >
                          {h.number}
                        </a>
                      </td>
                      <td className="px-4 py-3 font-semibold text-egypt-black">
                        {h.name}
                      </td>
                      <td className="px-4 py-3">
                        <Badge color="red">
                          {HOTLINE_TYPE_LABELS[h.hotline_type] || h.hotline_type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs max-w-md">
                        {h.description || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-gray-500">
                          {h.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-sand-100 text-sm text-gray-600 text-center bg-sand-50/50">
              إجمالي <strong>{data.total}</strong> عنصر
            </div>
          </>
        )}

        {!isLoading && !isError && data?.items?.length === 0 && (
          <div className="p-6 text-center text-gray-500">لا توجد بيانات</div>
        )}
      </div>
    </div>
  );
}
