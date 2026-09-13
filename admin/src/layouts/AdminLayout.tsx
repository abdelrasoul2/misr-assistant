import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "لوحة القيادة", icon: "📊", end: true },
  { to: "/categories", label: "التصنيفات", icon: "📁", end: false },
  { to: "/sources", label: "المصادر", icon: "🔗", end: false },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-gray-50" dir="rtl">
      {/* ===== Sidebar ===== */}
      <aside className="w-64 bg-white border-l border-gray-200 flex flex-col">
        {/* Brand */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-200">
          <span className="text-3xl">🇪🇬</span>
          <div>
            <div className="font-bold text-brand-700 leading-tight">
              مساعد مصر
            </div>
            <div className="text-xs text-gray-500">لوحة التحكم</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-50 text-brand-700 border border-brand-100"
                    : "text-gray-700 hover:bg-gray-100",
                ].join(" ")
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 text-xs text-gray-500 text-center">
          الإصدار 0.1.0
        </div>
      </aside>

      {/* ===== Main ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="text-sm text-gray-500">
            الإدارة ← <span className="text-gray-700 font-medium">مساعد مصر</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">abdelrasoul</div>
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}