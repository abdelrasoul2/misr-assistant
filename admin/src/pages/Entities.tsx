import { useState } from "react";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import PharaohPattern from "../components/patterns/PharaohPattern";
import {
  ENTITY_TYPE_LABELS,
  type EntityType,
} from "../features/entities/types";
import { useEntities } from "../features/entities/hooks";
import { useSectors } from "../features/sectors/hooks";

const ENTITY_TYPES: { key: EntityType | "all"; label: string }[] = [
  { key: "all", label: "\u0627\u0644\u0643\u0644" },
  { key: "ministry", label: "\u0648\u0632\u0627\u0631\u0629" },
  { key: "authority", label: "\u0647\u064A\u0626\u0629" },
  { key: "agency", label: "\u0645\u0635\u0644\u062D\u0629" },
  { key: "council", label: "\u0645\u062C\u0644\u0633" },
];

export default function Entities() {
  const [sectorId, setSectorId] = useState<number | undefined>();
  const [entityType, setEntityType] = useState<EntityType | "all">("all");

  const sectors = useSectors({ page: 1, page_size: 100 });

  const params: Record<string, unknown> = { page: 1, page_size: 100 };
  if (sectorId) params.sector_id = sectorId;
  if (entityType !== "all") params.entity_type = entityType;

  const { data, isLoading, isError } = useEntities(params);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-sand-100 via-sand-50 to-white border border-pharaoh-gold/30">
        <div className="h-1 flex">
          <div className="flex-1 bg-egypt-red" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-egypt-black" />
        </div>
        <div className="relative px-6 py-6 flex items-center gap-4">
          <span className="text-3xl">\U0001F3DB\uFE0F</span>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold">
              <span className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">
                \u0627\u0644\u062C\u0647\u0627\u062A \u0627\u0644\u062D\u0643\u0648\u0645\u064A\u0629
              </span>
            </h1>
            <p className="text-sm text-gray-600 mt-0.5">
              \u0627\u0644\u0648\u0632\u0627\u0631\u0627\u062A\u060C \u0627\u0644\u0647\u064A\u0626\u0627\u062A\u060C \u0627\u0644\u0645\u0635\u0627\u0644\u062D\u060C \u0627\u0644\u0645\u062C\u0627\u0644\u0633
            </p>
          </div>
        </div>
        <PharaohPattern className="opacity-25" height={16} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap bg-white rounded-xl border border-sand-200 p-2">
          <span className="text-xs text-gray-500 px-2 font-semibold">
            \u0627\u0644\u0646\u0648\u0639:
          </span>
          {ENTITY_TYPES.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setEntityType(t.key)}
              className={[
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                entityType === t.key
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
            \u0627\u0644\u0642\u0637\u0627\u0639:
          </span>
          <button
            type="button"
            onClick={() => setSectorId(undefined)}
            className={[
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              sectorId === undefined
                ? "bg-gradient-to-l from-pharaoh-gold-light to-pharaoh-gold/50 text-egypt-black shadow-sm"
                : "text-gray-600 hover:bg-sand-50",
            ].join(" ")}
          >
            \u0627\u0644\u0643\u0644
          </button>
          {sectors.data?.items.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSectorId(s.id)}
              className={[
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5",
                sectorId === s.id
                  ? "bg-gradient-to-l from-pharaoh-gold-light to-pharaoh-gold/50 text-egypt-black shadow-sm"
                  : "text-gray-600 hover:bg-sand-50",
              ].join(" ")}
            >
              <span>{s.icon}</span>
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden shadow-sm">
        {isLoading && <Spinner size="lg" />}

        {isError && (
          <div className="p-6 text-center text-egypt-red">
            <div className="text-3xl mb-2">\u26A0\uFE0F</div>
            <div className="font-semibold">\u062D\u062F\u062B \u062E\u0637\u0623 \u0641\u064A \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A</div>
          </div>
        )}

        {!isLoading && !isError && data && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-l from-sand-100 to-sand-50 border-b border-sand-200 text-gray-700">
                    <th className="px-4 py-3.5 text-right font-bold w-16">#</th>
                    <th className="px-4 py-3.5 text-right font-bold">\u0627\u0644\u0627\u0633\u0645</th>
                    <th className="px-4 py-3.5 text-right font-bold">\u0627\u0644\u0646\u0648\u0639</th>
                    <th className="px-4 py-3.5 text-right font-bold">Slug</th>
                    <th className="px-4 py-3.5 text-right font-bold">\u0627\u0644\u0645\u0648\u0642\u0639</th>
                    <th className="px-4 py-3.5 text-right font-bold">\u0647\u0627\u062A\u0641</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-100">
                  {data.items.map((e) => (
                    <tr
                      key={e.id}
                      className="hover:bg-sand-50/60 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                        {e.id}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-egypt-black">
                          {e.name}
                        </div>
                        {e.short_name && (
                          <div className="text-xs text-gray-500">
                            {e.short_name}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge color="blue">
                          {ENTITY_TYPE_LABELS[e.entity_type] || e.entity_type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-xs bg-sand-100 px-2 py-1 rounded-md text-gray-700 border border-sand-200">
                          {e.slug}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        {e.website ? (
                          <a
                            href={e.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pharaoh-blue hover:text-pharaoh-lapis hover:underline text-xs"
                            dir="ltr"
                          >
                            \u0632\u064A\u0627\u0631\u0629 \u2190
                          </a>
                        ) : (
                          <span className="text-gray-300">\u2014</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs font-mono" dir="ltr">
                        {e.phone || "\u2014"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 border-t border-sand-100 text-sm text-gray-600 text-center bg-sand-50/50">
              \u0625\u062C\u0645\u0627\u0644\u064A <strong>{data.total}</strong> \u062C\u0647\u0629
            </div>
          </>
        )}

        {!isLoading && !isError && data?.items?.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            \u0644\u0627 \u062A\u0648\u062C\u062F \u0646\u062A\u0627\u0626\u062C \u0645\u0637\u0627\u0628\u0642\u0629
          </div>
        )}
      </div>
    </div>
  );
}
