import { useEffect, useState, useCallback } from "react";
import { Trash2, RefreshCw, Search, X, ListChecks } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout.jsx";
import api from "../../api/axios.js";

const STATUS_COLORS = {
  active:    "bg-emerald-100 text-emerald-700",
  sold_out:  "bg-slate-100 text-slate-600",
  expired:   "bg-amber-100 text-amber-700",
  cancelled: "bg-red-100 text-red-600",
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
function ConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-7 shadow-xl">
        <p className="text-sm font-semibold text-slate-800">Delete this listing? This cannot be undone.</p>
        <div className="mt-6 flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
          <button onClick={onConfirm} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition">Delete</button>
        </div>
      </div>
    </div>
  );
}

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export default function AdminListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api.get("/admin/listings").then((r) => setListings(r.data.listings)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const doDelete = async (id) => {
    await api.delete(`/admin/listings/${id}`);
    setListings((prev) => prev.filter((l) => l._id !== id));
  };

  const filtered = listings.filter((l) =>
    l.seller?.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.location?.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Listings" subtitle="Review and manage all energy listings.">
      {confirm && <ConfirmModal onCancel={() => setConfirm(null)} onConfirm={() => { doDelete(confirm); setConfirm(null); }} />}

      <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <ListChecks size={16} className="text-slate-400" />
          <span className="text-sm font-semibold text-slate-500">{filtered.length} listings</span>
        </div>
        <div className="flex gap-3 items-center">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by seller or city…" />
          <button onClick={load} className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {loading ? <p className="mt-8 text-sm text-slate-400">Loading listings…</p> : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3.5">Seller</th>
                <th className="px-5 py-3.5">kWh</th>
                <th className="px-5 py-3.5">Price/kWh</th>
                <th className="px-5 py-3.5">City</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Created</th>
                <th className="px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((l) => (
                <tr key={l._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-slate-900">{l.seller?.name || "—"}</p>
                    <p className="text-xs text-slate-400">{l.seller?.email}</p>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">{l.availableKwh} kWh</td>
                  <td className="px-5 py-3.5 text-slate-700">₹{l.pricePerKwh}/kWh</td>
                  <td className="px-5 py-3.5 text-slate-500">{l.location?.city || l.seller?.address?.city || "—"}</td>
                  <td className="px-5 py-3.5"><Badge label={l.status} colorClass={STATUS_COLORS[l.status] || "bg-slate-100 text-slate-600"} /></td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">{fmtDate(l.createdAt)}</td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => setConfirm(l._id)} className="flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition">
                      <Trash2 size={12} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-400">No listings found</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
