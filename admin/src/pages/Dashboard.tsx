import { Link } from "react-router-dom";
import HieroglyphStrip from "../components/patterns/HieroglyphStrip";
import PharaohPattern from "../components/patterns/PharaohPattern";
import { useCategories } from "../features/categories/hooks";
import { useSources } from "../features/sources/hooks";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  color: string;
  isLoading: boolean;
  isError: boolean;
  to?: string;
}

function StatCard({
  label,
  value,
  icon,
  color,
  isLoading,
  isError,
  to,
}: StatCardProps) {
  const inner = (
    <div className="group relative bg-white rounded-2xl border border-sand-200 p-6 hover:border-pharaoh-gold/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div
        className={`absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b ${color}`}
      />
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-500 mb-2 font-medium">
            {label}
          </div>
          <div className="text-4xl font-display font-extrabold text-egypt-black">
            {isLoading ? (
              <span className="inline-block w-12 h-10 bg-sand-100 animate-pulse rounded" />
            ) : isError ? (
              <span className="text-egypt-red text-2xl">⚠️</span>
            ) : (
              value
            )}
          </div>
        </div>
        <div
          className={`text-3xl leading-none bg-gradient-to-br ${color} bg-clip-text text-transparent group-hover:scale-125 transition-transform duration-300`}
        >
          {icon}
        </div>
      </div>
      <PharaohPattern
        className="mt-4 opacity-20 group-hover:opacity-40 transition-opacity"
        height={16}
      />
    </div>
  );

  if (to && !isLoading && !isError) {
    return (
      <Link to={to} className="block">
        {inner}
      </Link>
    );
  }
  return inner;
}

const roadmap = [
  { status: "done", text: "STEP 6A — مشروع Vite + React + TypeScript" },
  { status: "done", text: "STEP 6B — Tailwind + Router + Query + Axios" },
  { status: "done", text: "STEP 6C — Tailwind + RTL + Arabic UI" },
  { status: "done", text: "STEP 6D — Layout + Navigation" },
  { status: "done", text: "STEP 6E — Categories CRUD" },
  { status: "done", text: "STEP 6F — Sources CRUD" },
  { status: "active", text: "STEP 6G — Dashboard بأرقام حقيقية" },
  { status: "pending", text: "STEP 7 — Government Offices + Maps" },
  { status: "pending", text: "STEP 8 — Legal Knowledge Base" },
  { status: "pending", text: "STEP 9 — Document Workflows" },
  { status: "pending", text: "STEP 10 — Source Crawler" },
];

export default function Dashboard() {
  const categories = useCategories({ page: 1, page_size: 1 });
  const sources = useSources({ page: 1, page_size: 1 });

  const stats = [
    {
      label: "التصنيفات",
      value: categories.data?.total ?? "—",
      icon: "𓂀",
      color: "from-pharaoh-gold to-pharaoh-gold-dark",
      isLoading: categories.isLoading,
      isError: categories.isError,
      to: "/categories",
    },
    {
      label: "المصادر",
      value: sources.data?.total ?? "—",
      icon: "𓋹",
      color: "from-egypt-red to-egypt-red-dark",
      isLoading: sources.isLoading,
      isError: sources.isError,
      to: "/sources",
    },
    {
      label: "الخدمات",
      value: "—",
      icon: "⚖️",
      color: "from-pharaoh-blue to-pharaoh-lapis",
      isLoading: false,
      isError: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* ===== Hero ===== */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-sand-100 via-sand-50 to-white border border-pharaoh-gold/30 shadow-sm">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute -left-10 -top-10 text-[200px] leading-none text-pharaoh-gold">
            𓂀
          </div>
          <div className="absolute -right-10 -bottom-10 text-[200px] leading-none text-egypt-red">
            𓋹
          </div>
        </div>

        <div className="h-1 flex">
          <div className="flex-1 bg-egypt-red" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-egypt-black" />
        </div>

        <div className="relative px-8 py-10">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl float-anim">𓂀</span>
            <h1 className="text-3xl md:text-4xl font-display font-extrabold">
              <span className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">
                لوحة القيادة
              </span>
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl leading-relaxed">
            نظرة عامة على نظام{" "}
            <span className="font-bold text-egypt-red">مساعد مصر</span>{" "}
            — منصة تبسيط وتجميع المعلومات الحكومية للمواطن المصري
          </p>
          <HieroglyphStrip className="mt-6" />
        </div>
      </div>

      {/* ===== Stats ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* ===== Roadmap ===== */}
      <div className="bg-white rounded-2xl border border-sand-200 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-l from-egypt-red via-pharaoh-gold to-egypt-black" />
        <div className="flex items-center gap-3 mb-5">
          <span className="text-2xl">𓊪</span>
          <h2 className="text-xl font-display font-bold text-egypt-black">
            خريطة الطريق
          </h2>
        </div>
        <ul className="space-y-3">
          {roadmap.map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-sm">
              <span
                className={[
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                  item.status === "done"
                    ? "bg-green-100 text-green-700"
                    : item.status === "active"
                    ? "bg-pharaoh-gold/30 text-pharaoh-gold-dark ring-2 ring-pharaoh-gold"
                    : "bg-sand-100 text-gray-400",
                ].join(" ")}
              >
                {item.status === "done"
                  ? "✓"
                  : item.status === "active"
                  ? "◉"
                  : "○"}
              </span>
              <span
                className={
                  item.status === "done"
                    ? "text-gray-500 line-through"
                    : item.status === "active"
                    ? "text-egypt-black font-semibold"
                    : "text-gray-600"
                }
              >
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}