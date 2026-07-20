import { useEffect, useMemo, useState } from "react";
import { CircleAlert, Leaf, MapPin, Plus, Tag } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout.jsx";
import api from "../../api/axios.js";

const number = (value) => Number(value || 0);

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ availableKwh: "1", pricePerKwh: "6", city: "" });
  const load = () => api.get("/listings/mine").then(({ data }) => setListings(data));

  useEffect(() => {
    load().catch(() => setNotice("Could not load your listings."));
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setNotice("");
    try {
      await api.post("/listings", { availableKwh: Number(form.availableKwh), pricePerKwh: Number(form.pricePerKwh), location: { city: form.city } });
      setNotice("Listing is now live in the marketplace.");
      setForm({ availableKwh: "1", pricePerKwh: "6", city: "" });
      load();
    } catch (err) {
      setNotice(err.response?.data?.message || "Could not create listing.");
    } finally {
      setSaving(false);
    }
  };

  const active = useMemo(() => listings.filter((item) => item.status === "active"), [listings]);

  return (
    <DashboardLayout title="My energy listings" subtitle="Publish your measured solar surplus at a price you choose for your local community.">
      {notice && <div className={`mt-6 flex items-start gap-3 rounded-xl border p-4 text-sm ${notice.includes("live") ? "border-green-100 bg-green-50 text-green-800" : "border-amber-100 bg-amber-50 text-amber-900"}`}><CircleAlert size={18} className="mt-0.5 shrink-0" />{notice}</div>}
      <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="panel p-5 sm:p-6"><div className="flex items-start gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-green-50 text-green-700"><Plus size={19} /></span><div><p className="eyebrow">Create an offer</p><h2 className="mt-1 font-heading text-lg font-semibold text-slate-900">Publish surplus energy</h2></div></div><form onSubmit={submit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"><label><span className="field-label">Energy available (kWh)</span><input required type="number" min="0.1" step="0.1" value={form.availableKwh} onChange={(event) => setForm({ ...form, availableKwh: event.target.value })} className="input-field" placeholder="e.g. 5.5" /></label><label><span className="field-label">Your price (₹ / kWh)</span><input required type="number" min="0.01" step="0.01" value={form.pricePerKwh} onChange={(event) => setForm({ ...form, pricePerKwh: event.target.value })} className="input-field" placeholder="e.g. 6.00" /></label><label className="sm:col-span-2"><span className="field-label">City <span className="font-normal text-slate-400">(optional)</span></span><div className="relative"><MapPin size={16} className="pointer-events-none absolute left-3.5 top-[19px] text-slate-400" /><input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} className="input-field pl-9" placeholder="e.g. Indore" /></div></label><button disabled={saving} className="btn-primary sm:col-span-2">{saving ? "Publishing…" : <><Leaf size={17} /> Publish listing</>}</button></form></section>
        <section className="rounded-2xl bg-slate-900 p-6 text-white"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-green-300"><Tag size={19} /></span><p className="mt-6 text-sm font-medium text-slate-300">Currently active</p><p className="mt-2 font-heading text-4xl font-semibold">{active.length}</p><p className="mt-2 text-sm leading-6 text-slate-300">{active.length ? `${active.reduce((total, item) => total + number(item.availableKwh), 0).toFixed(1)} kWh is visible to nearby consumers.` : "Publish your first listing to make your solar surplus available to the community."}</p><div className="mt-7 border-t border-white/10 pt-5 text-xs leading-5 text-slate-300">Listings are settled automatically when a buyer confirms a purchase from the marketplace.</div></section>
      </div>
      <section className="mt-6"><div className="mb-3"><p className="eyebrow">Listing history</p><h2 className="mt-1 font-heading text-lg font-semibold text-slate-900">All published offers</h2></div><div className="table-shell"><table className="min-w-[650px] w-full text-left text-sm"><thead className="table-header"><tr><th className="px-5 py-3.5">Available energy</th><th className="px-5 py-3.5">Your price</th><th className="px-5 py-3.5">Status</th><th className="px-5 py-3.5">Created</th></tr></thead><tbody className="divide-y divide-slate-100">{listings.map((item) => <tr className="hover:bg-slate-50/70" key={item._id}><td className="px-5 py-4 font-semibold text-slate-800">{number(item.availableKwh).toFixed(1)} kWh</td><td className="px-5 py-4 font-semibold text-slate-800">₹{number(item.pricePerKwh).toFixed(2)}<span className="font-normal text-slate-400">/kWh</span></td><td className="px-5 py-4"><span className={`status-pill capitalize ${item.status === "active" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"}`}>{item.status?.replace("_", " ")}</span></td><td className="px-5 py-4 text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td></tr>)}{!listings.length && <tr><td colSpan="4" className="px-6 py-14 text-center"><p className="font-medium text-slate-700">No listings published yet</p><p className="mt-1 text-sm text-slate-500">Use the form above to add your first solar-energy offer.</p></td></tr>}</tbody></table></div></section>
    </DashboardLayout>
  );
}
