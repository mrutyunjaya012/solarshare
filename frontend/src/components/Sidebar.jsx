import { NavLink, useNavigate } from "react-router-dom";
import {
  ArrowLeftRight,
  BarChart3,
  LayoutDashboard,
  Leaf,
  ListChecks,
  LogOut,
  ShoppingBag,
  Users,
  WalletCards,
  X,
  Zap,
} from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";

const MENUS = {
  prosumer: [
    { label: "Overview", path: "/prosumer", icon: LayoutDashboard, end: true },
    { label: "My listings", path: "/prosumer/listings", icon: Leaf },
    { label: "Marketplace", path: "/marketplace", icon: ShoppingBag },
    { label: "Transactions", path: "/prosumer/transactions", icon: BarChart3 },
    { label: "Wallet", path: "/prosumer/wallet", icon: WalletCards },
  ],
  consumer: [
    { label: "Overview", path: "/consumer", icon: LayoutDashboard, end: true },
    { label: "Marketplace", path: "/marketplace", icon: ShoppingBag },
    { label: "Transactions", path: "/consumer/transactions", icon: BarChart3 },
    { label: "Wallet", path: "/consumer/wallet", icon: WalletCards },
  ],
  admin: [
    { label: "Overview",      path: "/admin",                icon: LayoutDashboard, end: true },
    { label: "Users",         path: "/admin/users",          icon: Users },
    { label: "Listings",      path: "/admin/listings",       icon: ListChecks },
    { label: "Transactions",  path: "/admin/transactions",   icon: ArrowLeftRight },
    { label: "Smart Meters",  path: "/admin/meters",         icon: Zap },
  ],

};

const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = MENUS[user?.role] || [];
  const initials = user?.name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "SS";

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      onClose();
      navigate("/login");
    }
  };

  return (
    <>
      {isOpen && <button aria-label="Close navigation" onClick={onClose} className="fixed inset-0 z-40 bg-slate-950/45 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[17rem] flex-col bg-[#0c1729] px-3 text-white transition-transform duration-200 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-3 pb-7 pt-6">
          <NavLink to={user?.role ? `/${user.role}` : "/"} onClick={onClose} className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-lg font-bold shadow-lg shadow-green-950/25">S</span>
            <span>
              <span className="block font-heading text-lg font-semibold tracking-tight">SolarShare</span>
              <span className="block text-[10px] font-medium uppercase tracking-[0.17em] text-slate-400">Energy exchange</span>
            </span>
          </NavLink>
          <button aria-label="Close menu" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"><X size={19} /></button>
        </div>

        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Workspace</p>
        <nav className="flex-1 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-primary text-white shadow-sm" : "text-slate-300 hover:bg-white/[0.07] hover:text-white"}`}
              >
                <Icon size={18} strokeWidth={2} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/20 text-xs font-semibold text-green-200">{initials}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{user?.name || "Solar member"}</p>
              <p className="mt-0.5 truncate text-xs capitalize text-slate-400">{user?.role || "member"}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="mt-3 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white">
            <LogOut size={15} /> Log out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
