import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import PharaohPattern from "../components/patterns/PharaohPattern";
import { useSectors } from "../features/sectors/hooks";

export default function Sectors() {
  const { data, isLoading, isError } = useSectors({ page: 1, page_size: 100 });

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-sand-100 via-sand-50 to-white border border-pharaoh-gold/30">
        <div className="h-1 flex">
          <div className="flex-1 bg-egypt-red" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-egypt-black" />
        </div>
        <div className="relative px-6 py-6 flex items-center gap-4">
          <span className="text-3xl">⚖️</span>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold">
              <span className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">
                القطاعات الحكومية
              </span>
            </h1>
            <p className="text-sm text-gray-600 mt-0.5">
              القطاعات الرئيسية للحكومة المصرية
            </p>
          </div>
        </div>
        <PharaohPattern className="opacity-25" height={16} />
      </div>

      {isLoading && <Spinner size="lg" />}

      {isError && (
        <div className="p-6 text-center text-egypt-red bg-white rounded-2xl border border-red-200">
          <div className="text-3xl mb-2">⚠️</div>
          <div className="font-semibold">حدث خطأ في تحميل البيانات</div>
        </div>
      )}

      {!isLoading && !isError && (data?.items?.length ?? 0) === 0 && (
        <EmptyState icon="⚖️" title="لا توجد قطاعات" />
      )}

      {!isLoading && !isError && data && data.items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.items.map((s) => (
            <div
              key={s.id}
              className="group relative bg-white rounded-2xl border border-sand-200 p-6 hover:border-pharaoh-gold/50 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div
                className="absolute top-0 right-0 left-0 h-1.5"
                style={{ backgroundColor: s.color ?? "#d4af37" }}
              />

              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
                  style={{ backgroundColor: (s.color ?? "#d4af37") + "20" }}
                >
                  {s.icon ?? "🏛️"}
                </div>
                <div
                  className="text-xs px-2 py-1 rounded-full font-mono"
                  style={{
                    backgroundColor: (s.color ?? "#d4af37") + "20",
                    color: s.color ?? "#d4af37",
                  }}
                >
                  #{s.sort_order}
                </div>
              </div>

              <h3 className="font-display font-bold text-lg text-egypt-black mb-1">
                {s.name}
              </h3>
              <code className="text-xs bg-sand-100 px-2 py-0.5 rounded text-gray-600">
                {s.slug}
              </code>

              {s.description && (
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                  {s.description}
                </p>
              )}

              <PharaohPattern
                className="mt-4 opacity-20 group-hover:opacity-40 transition-opacity"
                height={16}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
