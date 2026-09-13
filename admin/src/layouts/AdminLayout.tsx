import { NavLink, Outlet } from "react-router-dom";
import PharaohPattern from "../components/patterns/PharaohPattern";

const navItems = [
  { to: "/", label: "لوحة القيادة", icon: "⚱️", end: true },
  { to: "/categories", label: "التصنيفات", icon: "𓂀", end: false },
  { to: "/sources", label: "المصادر", icon: "𓋹", end: false },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-sand-50" dir="rtl">
      {/* ===== Sidebar ===== */}
      <aside className="w-64 bg-white flex flex-col relative">
        {/* شريط علوي بألوان علم مصر */}
        <div className="h-1.5 flex">
          <div className="flex-1 bg-egypt-red" />
          <div className="flex-1 bg-white border-y border-sand-200" />
          <div className="flex-1 bg-egypt-black" />
        </div>

        {/* Brand */}
        <div className="px-6 py-5 border-b border-sand-200 relative">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pharaoh-gold-light via-pharaoh-gold to-pharaoh-gold-dark flex items-center justify-center shadow-md float-anim">
              <span className="text-2xl">𓂀</span>
            </div>
            <div>
              <div className="font-display font-bold text-lg leading-tight bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">
                مساعد مصر
              </div>
              <div className="text-xs text-gray-500 font-medium">
                لوحة التحكم
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative",
                  isActive
                    ? "bg-gradient-to-l from-pharaoh-gold-light/60 to-pharaoh-gold/30 text-egypt-black shadow-sm border border-pharaoh-gold/40"
                    : "text-gray-700 hover:bg-sand-100 hover:text-egypt-red",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  {/* شريط أحمر على اليمين لو active */}
                  {isActive && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-l-full bg-egypt-red" />
                  )}
                  <span
                    className={[
                      "text-xl leading-none transition-transform",
                      isActive ? "scale-110" : "group-hover:scale-110",
                    ].join(" ")}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Decorative divider */}
        <PharaohPattern className="opacity-30" />

        {/* Footer */}
        <div className="p-4 text-xs text-gray-500 text-center border-t border-sand-200">
          <div className="font-display font-semibold text-pharaoh-gold-dark">
            الإصدار 0.1.0
          </div>
          <div className="mt-1 text-[10px] text-gray-400">
            صُنع بـ 𓂀 في مصر
          </div>
        </div>
      </aside>

      {/* ===== Main ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-sand-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="text-lg text-pharaoh-gold">𓊪</span>
            <div className="text-sm text-gray-500">
              الإدارة
              <span className="mx-2 text-pharaoh-gold">⟵</span>
              <span className="text-egypt-black font-semibold">
                مساعد مصر
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600 font-medium">
              abdelrasoul
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-egypt-red to-egypt-red-dark text-white flex items-center justify-center font-bold shadow-md ring-2 ring-pharaoh-gold/40">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>

        {/* Footer bar بألوان العلم */}
        <footer className="h-1 flex">
          <div className="flex-1 bg-egypt-red" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-egypt-black" />
        </footer>
      </div>
    </div>
  );
}