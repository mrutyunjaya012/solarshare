import { useEffect, useState, useCallback } from "react";
import { CheckCircle, RefreshCw, Search, X, ArrowLeftRight } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout.jsx";
import api from "../../api/axios.js";

const STATUS_COLORS = {
  completed: "bg-emerald-100 text-emerald-700",
  pending:   "bg-amber-100 text-amber-700",
  failed:    "bg-red-100 text-red-600",
  disputed:  "bg-orange-100 text-orange-700",
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

export default function AdminTransactions() {
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [resolving, setResolving] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api.get("/admin/transactions").then((r) => setTxns(r.data.transactions)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const doResolve = async (id, resolution) => {
    await api.patch(`/admin/transactions/${id}/resolve`, { resolution });
    setTxns((prev) => prev.map((t) => t._id === id ? { ...t, status: resolution } : t));
    setResolving(null);
  };

  const filtered = txns.filter((t) =>
    t.buyer?.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.seller?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Transactions" subtitle="View all platform trades and resolve disputes.">
      {resolving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-7 shadow-xl space-y-3">
            <p className="font-bold text-slate-900">Resolve Dispute</p>
            <p className="text-sm text-slate-500">Choose the resolution for this transaction:</p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => doResolve(resolving, "completed")} className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition">Mark Completed</button>
              <button onClick={() => doResolve(resolving, "failed")} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition">Mark Failed</button>
            </div>
            <button onClick={() => setResolving(null)} className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50 transition">Cancel</button>
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <ArrowLeftRight size={16} className="text-slate-400" />
          <span className="text-sm font-semibold text-slate-500">{filtered.length} transactions</span>
        </div>
        <div className="flex gap-3 items-center">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by buyer or seller…" />
          <button onClick={load} className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {loading ? <p className="mt-8 text-sm text-slate-400">Loading transactions…</p> : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3.5">Buyer</th>
                <th className="px-5 py-3.5">Seller</th>
                <th className="px-5 py-3.5">kWh</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((t) => (
                <tr key={t._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-slate-900">{t.buyer?.name || "—"}</p>
                    <p className="text-xs text-slate-400">{t.buyer?.email}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-slate-900">{t.seller?.name || "—"}</p>
                    <p className="text-xs text-slate-400">{t.seller?.email}</p>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">{Number(t.kwh).toFixed(2)} kWh</td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">₹{Number(t.totalAmount).toFixed(2)}</td>
                  <td className="px-5 py-3.5"><Badge label={t.status} colorClass={STATUS_COLORS[t.status] || "bg-slate-100 text-slate-600"} /></td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">{fmtDate(t.createdAt)}</td>
                  <td className="px-5 py-3.5">
                    {t.status === "disputed" && (
                      <button onClick={() => setResolving(t._id)} className="flex items-center gap-1 rounded-lg bg-orange-50 px-2.5 py-1.5 text-xs font-bold text-orange-700 hover:bg-orange-100 transition">
                        <CheckCircle size={12} /> Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-400">No transactions found</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
