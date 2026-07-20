import { useEffect, useState } from "react";
import { Activity, BarChart3, CircleDollarSign, Leaf, Users, Shield } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout.jsx";
import api from "../../api/axios.js";

function StatCard({ label, value, icon: Icon, accent }) {
  const accents = {
    blue:   "bg-blue-50 text-blue-600",
    green:  "bg-emerald-50 text-emerald-600",
    amber:  "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-600",
  };
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accents[accent]}`}><Icon size={20} /></span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="mt-1 font-heading text-2xl font-extrabold text-slate-900">{value ?? "—"}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    api.get("/admin/overview").then((r) => setOverview(r.data)).catch(() => {});
  }, []);

  return (
    <DashboardLayout title="Grid Overview" subtitle="A live pulse of the SolarShare community and its energy marketplace.">
      <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Total Users"     value={overview?.totalUsers}                                   icon={Users}            accent="blue" />
        <StatCard label="Active Listings" value={overview?.activeListings}                               icon={Activity}         accent="green" />
        <StatCard label="Energy Traded"   value={overview ? `${Number(overview.energySoldKwh).toFixed(1)} kWh` : null} icon={Leaf} accent="amber" />
        <StatCard label="Platform Volume" value={overview ? `₹${Number(overview.platformVolume).toFixed(0)}` : null}   icon={CircleDollarSign} accent="violet" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><BarChart3 size={18} /></span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Platform Health</p>
              <h3 className="font-heading text-base font-bold text-slate-900">Marketplace is operational</h3>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Users",    value: overview?.totalUsers,                                      sub: "Community accounts" },
              { label: "Listings", value: overview?.activeListings,                                  sub: "Active offers" },
              { label: "Revenue",  value: overview ? `₹${Number(overview.platformVolume).toFixed(0)}` : "—", sub: "Settled value" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-xs font-semibold text-slate-500">{s.label}</p>
                <p className="mt-1.5 font-heading text-xl font-bold text-slate-900">{s.value ?? "—"}</p>
                <p className="mt-1 text-[11px] text-slate-400">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><Shield size={18} /></span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Admin Checklist</p>
              <h3 className="font-heading text-base font-bold text-slate-900">Operations status</h3>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { color: "bg-emerald-500", title: "Marketplace activity",  desc: "Review active listings and completed volume." },
              { color: "bg-blue-500",    title: "Account support",        desc: "Manage user roles and block/unblock accounts." },
              { color: "bg-amber-500",   title: "Meter data",             desc: "Smart-meter readings update dashboards automatically." },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.color}`} />
                <div>
                  <p className="text-sm font-bold text-slate-800">{item.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
