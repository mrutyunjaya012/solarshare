import { useEffect, useState } from "react";
import { Activity, BarChart3, CircleDollarSign, Leaf, Users } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout.jsx";
import StatCard from "../../components/StatCard.jsx";
import api from "../../api/axios.js";

const number = (value) => Number(value || 0);

const AdminDashboard = () => {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    api.get("/admin/overview").then((res) => setOverview(res.data)).catch(() => {});
  }, []);

  return (
    <DashboardLayout title="Grid overview" subtitle="A live pulse of the SolarShare community and its energy marketplace.">
      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Community members" value={overview ? overview.totalUsers : "—"} sublabel="Registered platform users" icon={Users} accent="blue" />
        <StatCard label="Active listings" value={overview ? overview.activeListings : "—"} sublabel="Energy offers available now" icon={Activity} accent="green" />
        <StatCard label="Energy traded" value={overview ? `${number(overview.energySoldKwh).toFixed(1)} kWh` : "—"} sublabel="Completed marketplace volume" icon={Leaf} accent="amber" />
        <StatCard label="Platform volume" value={overview ? `₹${number(overview.platformVolume).toFixed(2)}` : "—"} sublabel="Value settled through SolarShare" icon={CircleDollarSign} accent="violet" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="panel p-5 sm:p-6">
          <div className="flex items-start gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-green-50 text-green-700"><BarChart3 size={19} /></span><div><p className="eyebrow">Platform health</p><h2 className="mt-1 font-heading text-lg font-semibold text-slate-900">Marketplace is operational</h2></div></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4"><p className="text-xs font-medium text-slate-500">User network</p><p className="mt-2 text-lg font-semibold text-slate-900">{overview?.totalUsers ?? "—"}</p><p className="mt-1 text-xs text-slate-400">Community accounts</p></div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4"><p className="text-xs font-medium text-slate-500">Trading supply</p><p className="mt-2 text-lg font-semibold text-slate-900">{overview?.activeListings ?? "—"}</p><p className="mt-1 text-xs text-slate-400">Current offers</p></div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4"><p className="text-xs font-medium text-slate-500">Settlement value</p><p className="mt-2 text-lg font-semibold text-slate-900">₹{number(overview?.platformVolume).toFixed(0)}</p><p className="mt-1 text-xs text-slate-400">Completed trades</p></div>
          </div>
          <p className="mt-6 text-sm leading-6 text-slate-500">These figures are calculated from current user, listing, and completed transaction records. Refresh the page to retrieve the latest activity.</p>
        </section>

        <section className="panel p-5 sm:p-6">
          <p className="eyebrow">Operations</p>
          <h2 className="mt-1 font-heading text-lg font-semibold text-slate-900">Admin checklist</h2>
          <div className="mt-6 space-y-4">
            <div className="flex gap-3"><span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-green-500" /><div><p className="text-sm font-semibold text-slate-800">Marketplace activity</p><p className="mt-1 text-xs leading-5 text-slate-500">Review active listings and completed volume from the live metrics.</p></div></div>
            <div className="flex gap-3"><span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-blue-500" /><div><p className="text-sm font-semibold text-slate-800">Account support</p><p className="mt-1 text-xs leading-5 text-slate-500">User roles and registration controls are handled by the existing access flow.</p></div></div>
            <div className="flex gap-3"><span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-amber-500" /><div><p className="text-sm font-semibold text-slate-800">Meter data</p><p className="mt-1 text-xs leading-5 text-slate-500">Smart-meter readings continue to update the user dashboards automatically.</p></div></div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
