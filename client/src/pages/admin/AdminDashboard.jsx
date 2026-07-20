import { useEffect, useState, useCallback } from "react";
import {
  LayoutDashboard, Users, ListChecks, ArrowLeftRight,
  Zap, Trash2, Ban, CheckCircle, RefreshCw, Search,
  Activity, BarChart3, CircleDollarSign, Leaf, Shield,
  ChevronDown, X
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout.jsx";
import api from "../../api/axios.js";

/* ── helpers ─────────────────────────────── */
const fmt = (n) => Number(n || 0).toFixed(2);
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

const TABS = [
  { key: "overview",     label: "Overview",      icon: LayoutDashboard },
  { key: "users",        label: "Users",         icon: Users },
  { key: "listings",     label: "Listings",      icon: ListChecks },
  { key: "transactions", label: "Transactions",  icon: ArrowLeftRight },
  { key: "meters",       label: "Smart Meters",  icon: Zap },
];

const ROLE_COLORS = {
  prosumer: "bg-emerald-100 text-emerald-700",
  consumer: "bg-blue-100 text-blue-700",
  admin:    "bg-violet-100 text-violet-700",
};

const STATUS_COLORS = {
  active:    "bg-emerald-100 text-emerald-700",
  sold_out:  "bg-slate-100 text-slate-600",
  expired:   "bg-amber-100 text-amber-700",
  cancelled: "bg-red-100 text-red-600",
  completed: "bg-emerald-100 text-emerald-700",
  pending:   "bg-amber-100 text-amber-700",
  failed:    "bg-red-100 text-red-600",
  disputed:  "bg-orange-100 text-orange-700",
};

/* ── small reusable components ──────────── */
function Badge({ label, colorClass }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${colorClass}`}>
      {label}
    </span>
  );
}

function StatCard({ label, value, icon: Icon, accent }) {
  const accents = {
    blue:   "bg-blue-50 text-blue-600",
    green:  "bg-emerald-50 text-emerald-600",
    amber:  "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-600",
  };
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accents[accent]}`}>
        <Icon size={20} />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="mt-1 font-heading text-2xl font-extrabold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <Search size={15} className="absolute left-3 top-[11px] text-slate-400 pointer-events-none" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search…"}
        className="rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 focus:outline-none w-full sm:w-64"
      />
      {value && (
        <button onClick={() => onChange("")} className="absolute right-3 top-[11px] text-slate-400 hover:text-slate-600">
          <X size={14} />
        </button>
      )}
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

/* ── TAB: Overview ──────────────────────── */
function OverviewTab({ overview }) {
  if (!overview) return <p className="text-sm text-slate-400 mt-8">Loading…</p>;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Total Users"       value={overview.totalUsers}                                icon={Users}            accent="blue" />
        <StatCard label="Active Listings"   value={overview.activeListings}                            icon={Activity}         accent="green" />
        <StatCard label="Energy Traded"     value={`${Number(overview.energySoldKwh).toFixed(1)} kWh`} icon={Leaf}             accent="amber" />
        <StatCard label="Platform Volume"   value={`₹${Number(overview.platformVolume).toFixed(0)}`}   icon={CircleDollarSign} accent="violet" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
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
              { label: "Users", value: overview.totalUsers, sub: "Community accounts" },
              { label: "Listings", value: overview.activeListings, sub: "Active offers" },
              { label: "Revenue", value: `₹${Number(overview.platformVolume).toFixed(0)}`, sub: "Settled value" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-xs font-semibold text-slate-500">{s.label}</p>
                <p className="mt-1.5 font-heading text-xl font-bold text-slate-900">{s.value}</p>
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
              { color: "bg-emerald-500", title: "Marketplace activity", desc: "Review active listings and completed volume." },
              { color: "bg-blue-500",    title: "Account support",      desc: "Manage user roles and block/unblock accounts." },
              { color: "bg-amber-500",   title: "Meter data",           desc: "Smart-meter readings update dashboards automatically." },
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
    </div>
  );
}

/* ── TAB: Users ─────────────────────────── */
function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState(null); // { type, userId, userName }

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
    <div className="space-y-4">
      {confirm && (
        <ConfirmModal
          message={confirm.type === "delete"
            ? `Delete user "${confirm.userName}"? This cannot be undone.`
            : `${confirm.isBlocked ? "Unblock" : "Block"} user "${confirm.userName}"?`}
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            if (confirm.type === "delete") doDelete(confirm.userId);
            else doBlock(confirm.userId);
            setConfirm(null);
          }}
        />
      )}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h3 className="font-heading text-lg font-bold text-slate-900">All Users <span className="ml-2 text-sm font-semibold text-slate-400">({filtered.length})</span></h3>
        <div className="flex gap-3 items-center">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email…" />
          <button onClick={load} className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {loading ? <p className="text-sm text-slate-400">Loading…</p> : (
        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
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
                    <Badge
                      label={u.isBlocked ? "Blocked" : "Active"}
                      colorClass={u.isBlocked ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"}
                    />
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">{fmtDate(u.createdAt)}</td>
                  <td className="px-5 py-3.5">
                    {u.role !== "admin" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setConfirm({ type: "block", userId: u._id, userName: u.name, isBlocked: u.isBlocked })}
                          className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${u.isBlocked ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-amber-50 text-amber-700 hover:bg-amber-100"}`}
                        >
                          {u.isBlocked ? <><CheckCircle size={12} /> Unblock</> : <><Ban size={12} /> Block</>}
                        </button>
                        <button
                          onClick={() => setConfirm({ type: "delete", userId: u._id, userName: u.name })}
                          className="flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-slate-400">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── TAB: Listings ──────────────────────── */
function ListingsTab() {
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
    <div className="space-y-4">
      {confirm && (
        <ConfirmModal
          message="Delete this listing? This cannot be undone."
          onCancel={() => setConfirm(null)}
          onConfirm={() => { doDelete(confirm); setConfirm(null); }}
        />
      )}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h3 className="font-heading text-lg font-bold text-slate-900">All Listings <span className="ml-2 text-sm font-semibold text-slate-400">({filtered.length})</span></h3>
        <div className="flex gap-3 items-center">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by seller or city…" />
          <button onClick={load} className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {loading ? <p className="text-sm text-slate-400">Loading…</p> : (
        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3.5">Seller</th>
                <th className="px-5 py-3.5">kWh Available</th>
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
                    <button
                      onClick={() => setConfirm(l._id)}
                      className="flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-slate-400">No listings found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── TAB: Transactions ──────────────────── */
function TransactionsTab() {
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
    <div className="space-y-4">
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

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h3 className="font-heading text-lg font-bold text-slate-900">All Transactions <span className="ml-2 text-sm font-semibold text-slate-400">({filtered.length})</span></h3>
        <div className="flex gap-3 items-center">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by buyer or seller…" />
          <button onClick={load} className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {loading ? <p className="text-sm text-slate-400">Loading…</p> : (
        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
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
                      <button
                        onClick={() => setResolving(t._id)}
                        className="flex items-center gap-1 rounded-lg bg-orange-50 px-2.5 py-1.5 text-xs font-bold text-orange-700 hover:bg-orange-100 transition"
                      >
                        <CheckCircle size={12} /> Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-slate-400">No transactions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── TAB: Smart Meters ──────────────────── */
function MetersTab() {
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
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h3 className="font-heading text-lg font-bold text-slate-900">Smart Meter Readings <span className="ml-2 text-sm font-semibold text-slate-400">({filtered.length})</span></h3>
        <div className="flex gap-3 items-center">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by user…" />
          <button onClick={load} className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {loading ? <p className="text-sm text-slate-400">Loading…</p> : (
        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
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
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-400">No meter readings found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── Main AdminDashboard ────────────────── */
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    api.get("/admin/overview").then((r) => setOverview(r.data)).catch(() => {});
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case "overview":     return <OverviewTab overview={overview} />;
      case "users":        return <UsersTab />;
      case "listings":     return <ListingsTab />;
      case "transactions": return <TransactionsTab />;
      case "meters":       return <MetersTab />;
      default:             return null;
    }
  };

  return (
    <DashboardLayout title="Admin Panel" subtitle="Manage users, listings, transactions and meter data.">
      {/* Tab Bar */}
      <div className="mt-6 flex gap-1 overflow-x-auto rounded-2xl border border-slate-100 bg-white p-1.5 shadow-sm">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
              activeTab === key
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">{renderTab()}</div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
