import { useState } from "react";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import PharaohPattern from "../components/patterns/PharaohPattern";
import {
  OFFICE_TYPE_LABELS,
  type OfficeType,
} from "../features/offices/types";
import { useOffices } from "../features/offices/hooks";
import { useGovernorates } from "../features/governorates/hooks";

const OFFICE_TYPES: { key: OfficeType | "all"; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "civil_registry", label: "سجل مدني" },
  { key: "traffic", label: "مرور" },
  { key: "passport", label: "جوازات" },
  { key: "real_estate", label: "شهر عقاري" },
  { key: "tax", label: "ضرائب" },
  { key: "court", label: "محكمة" },
  { key: "notary", label: "توثيق" },
];

export default function Offices() {
  const [govId, setGovId] = useState<number | undefined>();
  const [officeType, setOfficeType] = useState<OfficeType | "all">("all");

  const governorates = useGovernorates({ page: 1, page_size: 100 });

  const params: Record<string, unknown> = { page: 1, page_size: 200 };
  if (govId) params.governorate_id = govId;
  if (officeType !== "all") params.office_type = officeType;

  const { data, isLoading, isError } = useOffices(params);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-sand-100 via-sand-50 to-white border border-pharaoh-gold/30">
        <div className="h-1 flex">
          <div className="flex-1 bg-egypt-red" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-egypt-black" />
        </div>
        <div className="relative px-6 py-6 flex items-center gap-4">
          <span className="text-3xl">📍</span>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold">
              <span className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">
                المكاتب الحكومية
              </span>
            </h1>
            <p className="text-sm text-gray-600 mt-0.5">
              المكاتب والفروع الحكومية في مصر
            </p>
          </div>
        </div>
        <PharaohPattern className="opacity-25" height={16} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap bg-white rounded-xl border border-sand-200 p-2">
          <span className="text-xs text-gray-500 px-2 font-semibold">
            النوع:
          </span>
          {OFFICE_TYPES.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setOfficeType(t.key)}
              className={[
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                officeType === t.key
                  ? "bg-gradient-to-l from-pharaoh-gold-light to-pharaoh-gold/50 text-egypt-black shadow-sm"
                  : "text-gray-600 hover:bg-sand-50",
              ].join(" ")}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap bg-white rounded-xl border border-sand-200 p-2">
          <span className="text-xs text-gray-500 px-2 font-semibold">
            المحافظة:
          </span>
          <button
            type="button"
            onClick={() => setGovId(undefined)}
            className={[
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              govId === undefined
                ? "bg-gradient-to-l from-pharaoh-gold-light to-pharaoh-gold/50 text-egypt-black shadow-sm"
                : "text-gray-600 hover:bg-sand-50",
            ].join(" ")}
          >
            الكل
          </button>
          {governorates.data?.items.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGovId(g.id)}
              className={[
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                govId === g.id
                  ? "bg-gradient-to-l from-pharaoh-gold-light to-pharaoh-gold/50 text-egypt-black shadow-sm"
                  : "text-gray-600 hover:bg-sand-50",
              ].join(" ")}
            >
              {g.name_ar}
            </button>
          ))}
        </div>
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
                  <tr className="bg-gradient-to-l from-sand-100 to-sand-50 border-b border-sand-200 text-gray-700">
                    <th className="px-4 py-3.5 text-right font-bold w-16">#</th>
                    <th className="px-4 py-3.5 text-right font-bold">الاسم</th>
                    <th className="px-4 py-3.5 text-right font-bold">النوع</th>
                    <th className="px-4 py-3.5 text-right font-bold">العنوان</th>
                    <th className="px-4 py-3.5 text-right font-bold">هاتف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-100">
                  {data.items.map((o) => (
                    <tr key={o.id} className="hover:bg-sand-50/60 transition-colors">
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                        {o.id}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-egypt-black">
                          {o.name}
                        </div>
                        {o.city && (
                          <div className="text-xs text-gray-500">
                            {o.city} — {o.district}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge color="gold">
                          {OFFICE_TYPE_LABELS[o.office_type] || o.office_type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs max-w-xs">
                        {o.address}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs font-mono" dir="ltr">
                        {o.phone || "—"}
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
