import HieroglyphStrip from "../components/patterns/HieroglyphStrip";
import PharaohPattern from "../components/patterns/PharaohPattern";

const stats = [
  { label: "التصنيفات", value: "3", icon: "𓂀", color: "from-pharaoh-gold to-pharaoh-gold-dark" },
  { label: "المصادر", value: "5", icon: "𓋹", color: "from-egypt-red to-egypt-red-dark" },
  { label: "الخدمات", value: "12", icon: "⚖️", color: "from-pharaoh-blue to-pharaoh-lapis" },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* ===== Hero ===== */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-sand-100 via-sand-50 to-white border border-pharaoh-gold/30 shadow-sm">
        {/* خلفية زخرفية */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute -left-10 -top-10 text-[200px] leading-none text-pharaoh-gold">
            𓂀
          </div>
          <div className="absolute -right-10 -bottom-10 text-[200px] leading-none text-egypt-red">
            𓋹
          </div>
        </div>

        {/* شريط علوي بألوان مصر */}
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
          <div
            key={s.label}
            className="group relative bg-white rounded-2xl border border-sand-200 p-6 hover:border-pharaoh-gold/50 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            {/* شريط جانبي بألوان */}
            <div
              className={`absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b ${s.color}`}
            />

            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-2 font-medium">
                  {s.label}
                </div>
                <div className="text-4xl font-display font-extrabold text-egypt-black">
                  {s.value}
                </div>
              </div>
              <div
                className={`text-3xl leading-none bg-gradient-to-br ${s.color} bg-clip-text text-transparent group-hover:scale-125 transition-transform duration-300`}
              >
                {s.icon}
              </div>
            </div>

            <PharaohPattern
              className="mt-4 opacity-20 group-hover:opacity-40 transition-opacity"
              height={16}
            />
          </div>
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
          {[
            { status: "done", text: "STEP 6A — مشروع Vite + React + TypeScript" },
            { status: "done", text: "STEP 6B — Tailwind + Router + Query + Axios" },
            { status: "done", text: "STEP 6C — Tailwind + RTL + Arabic UI" },
            { status: "done", text: "STEP 6D — Layout + Navigation" },
            { status: "active", text: "STEP 6E — Categories CRUD (واجهة كاملة)" },
            { status: "pending", text: "STEP 6F — Sources CRUD (واجهة كاملة)" },
          ].map((item, i) => (
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
                {item.status === "done" ? "✓" : item.status === "active" ? "◉" : "○"}
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