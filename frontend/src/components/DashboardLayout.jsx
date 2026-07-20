import { useState } from "react";
import { Bell, Menu } from "lucide-react";
import Sidebar from "./Sidebar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const DashboardLayout = ({ title, subtitle, action, children }) => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = user?.name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "SS";

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="min-h-screen lg:pl-[17rem]">
        <header className="sticky top-0 z-30 flex h-[74px] items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-7 lg:px-9">
          <button aria-label="Open menu" onClick={() => setMenuOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"><Menu size={21} /></button>
          <div className="hidden lg:block"><p className="text-xs font-medium text-slate-400">Community solar marketplace</p></div>
          <div className="ml-auto flex items-center gap-3">
            <button aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50">
              <Bell size={18} />
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-primary" />
            </button>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-xs font-semibold text-white">{initials}</span>
          </div>
        </header>
        <section className="mx-auto max-w-[1440px] px-4 py-7 sm:px-7 lg:px-9 lg:py-9">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="page-title">{title}</h1>
              {subtitle && <p className="page-subtitle">{subtitle}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
          {children}
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;
