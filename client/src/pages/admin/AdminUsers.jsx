import { useEffect, useState, useCallback } from "react";
import {
  Users, Ban, CheckCircle, Trash2, RefreshCw, Search, X
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout.jsx";
import api from "../../api/axios.js";

const ROLE_COLORS = {
  prosumer: "bg-emerald-100 text-emerald-700",
  consumer: "bg-blue-100 text-blue-700",
  admin:    "bg-violet-100 text-violet-700",
};

function Badge({ label, colorClass }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${colorClass}`}>
      {label}
    </span>
  );
}

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <Search size={15} className="absolute left-3 top-[11px] text-slate-400 pointer-events-none" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 focus:outline-none w-full sm:w-64"
      />
      {value && <button onClick={() => onChange("")} className="absolute right-3 top-[11px] text-slate-400 hover:text-slate-600"><X size={14} /></button>}
    </div>
  );
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-7 shadow-xl">
        <p className="text-sm font-semibold text-slate-800">{message}</p>
        <div className="mt-6 flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
          <button onClick={onConfirm} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition">Confirm</button>
        </div>
      </div>
    </div>
  );
}

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api.get("/admin/users").then((r) => setUsers(r.data.users)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const doBlock = async (id) => {
    await api.patch(`/admin/users/${id}/block`);
    setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isBlocked: !u.isBlocked } : u));
  };
  const doDelete = async (id) => {
    await api.delete(`/admin/users/${id}`);
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Users" subtitle="Manage all registered platform users.">
      {confirm && (
        <ConfirmModal
          message={confirm.type === "delete"
            ? `Delete "${confirm.name}"? This cannot be undone.`
            : `${confirm.isBlocked ? "Unblock" : "Block"} "${confirm.name}"?`}
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            if (confirm.type === "delete") doDelete(confirm.id);
            else doBlock(confirm.id);
            setConfirm(null);
          }}
        />
      )}

      <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-slate-400" />
          <span className="text-sm font-semibold text-slate-500">{filtered.length} users</span>
        </div>
        <div className="flex gap-3 items-center">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email…" />
          <button onClick={load} className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-slate-400">Loading users…</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3.5">Name</th>
                <th className="px-5 py-3.5">Email</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">City</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Joined</th>
                <th className="px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-slate-900">{u.name}</td>
                  <td className="px-5 py-3.5 text-slate-500">{u.email}</td>
                  <td className="px-5 py-3.5"><Badge label={u.role} colorClass={ROLE_COLORS[u.role]} /></td>
                  <td className="px-5 py-3.5 text-slate-500">{u.address?.city || "—"}</td>
                  <td className="px-5 py-3.5">
                    <Badge label={u.isBlocked ? "Blocked" : "Active"}
                      colorClass={u.isBlocked ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"} />
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">{fmtDate(u.createdAt)}</td>
                  <td className="px-5 py-3.5">
                    {u.role !== "admin" && (
                      <div className="flex gap-2">
                        <button onClick={() => setConfirm({ type: "block", id: u._id, name: u.name, isBlocked: u.isBlocked })}
                          className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${u.isBlocked ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-amber-50 text-amber-700 hover:bg-amber-100"}`}>
                          {u.isBlocked ? <><CheckCircle size={12} /> Unblock</> : <><Ban size={12} /> Block</>}
                        </button>
                        <button onClick={() => setConfirm({ type: "delete", id: u._id, name: u.name })}
                          className="flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition">
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-400">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
