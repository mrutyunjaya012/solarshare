import { useEffect, useState, useCallback } from "react";
import { RefreshCw, Search, X, Zap } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout.jsx";
import api from "../../api/axios.js";

const ROLE_COLORS = {
  prosumer: "bg-emerald-100 text-emerald-700",
  consumer: "bg-blue-100 text-blue-700",
};

function Badge({ label, colorClass }) {
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${colorClass}`}>{label}</span>;
}
function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <Search size={15} className="absolute left-3 top-[11px] text-slate-400 pointer-events-none" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 focus:outline-none w-full sm:w-64"
      />
      {value && <button onClick={() => onChange("")} className="absolute right-3 top-[11px] text-slate-400 hover:text-slate-600"><X size={14} /></button>}
    </div>
  );
}

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

export default function AdminMeters() {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    api.get("/admin/meters").then((r) => setReadings(r.data.readings)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = readings.filter((r) =>
    r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Smart Meters" subtitle="Live meter readings from all prosumers and consumers.">
      <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-slate-400" />
          <span className="text-sm font-semibold text-slate-500">{filtered.length} readings</span>
        </div>
        <div className="flex gap-3 items-center">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by user…" />
          <button onClick={load} className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {loading ? <p className="mt-8 text-sm text-slate-400">Loading meter data…</p> : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Generated</th>
                <th className="px-5 py-3.5">Consumed</th>
                <th className="px-5 py-3.5">Surplus</th>
                <th className="px-5 py-3.5">Recorded At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((r) => (
                <tr key={r._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-slate-900">{r.user?.name || "—"}</p>
                    <p className="text-xs text-slate-400">{r.user?.email}</p>
                  </td>
                  <td className="px-5 py-3.5"><Badge label={r.role} colorClass={ROLE_COLORS[r.role] || "bg-slate-100 text-slate-600"} /></td>
                  <td className="px-5 py-3.5 text-emerald-700 font-bold">{Number(r.generationKwh).toFixed(3)} kWh</td>
                  <td className="px-5 py-3.5 text-slate-700 font-bold">{Number(r.consumptionKwh).toFixed(3)} kWh</td>
                  <td className={`px-5 py-3.5 font-bold ${Number(r.surplusKwh) > 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {Number(r.surplusKwh).toFixed(3)} kWh
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">{fmtDate(r.recordedAt)}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-400">No meter readings found</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
