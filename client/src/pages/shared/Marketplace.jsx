import { useEffect, useMemo, useState } from "react";
import { CircleAlert, MapPin, ShoppingBag, Zap } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../api/axios.js";

const number = (value) => Number(value || 0);

export default function Marketplace() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [notice, setNotice] = useState("");
  const [purchasing, setPurchasing] = useState("");

  const load = () => api.get("/listings?sort=price_asc").then(({ data }) => setListings(data));

  useEffect(() => {
    load().catch(() => setNotice("Could not load marketplace right now."));
  }, []);

  const buy = async (listing) => {
    setPurchasing(listing._id);
    setNotice("");
    try {
      const { data } = await api.post("/transactions/purchase", { listingId: listing._id, kwh: Number(quantity[listing._id] || 1) });
      setNotice(`Purchase complete: ${data.kwh} kWh for ₹${number(data.totalAmount).toFixed(2)}.`);
      load();
    } catch (err) {
      setNotice(err.response?.data?.message || "Purchase could not be completed.");
    } finally {
      setPurchasing("");
    }
  };

  const cheapestPrice = useMemo(() => listings.length ? Math.min(...listings.map((item) => number(item.pricePerKwh))) : null, [listings]);

  return (
    <DashboardLayout title="Energy marketplace" subtitle="Buy verified surplus solar energy directly from homes in your community.">
      {notice && <div className={`mt-6 flex items-start gap-3 rounded-xl border p-4 text-sm ${notice.toLowerCase().includes("complete") ? "border-green-100 bg-green-50 text-green-800" : "border-amber-100 bg-amber-50 text-amber-900"}`}><CircleAlert size={18} className="mt-0.5 shrink-0" />{notice}</div>}
      <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="panel p-5"><p className="text-sm font-medium text-slate-500">Active offers</p><p className="mt-3 font-heading text-2xl font-semibold text-slate-900">{listings.length}</p><p className="mt-1 text-xs text-slate-500">Local energy listings available</p></div>
        <div className="panel p-5"><p className="text-sm font-medium text-slate-500">Best listed price</p><p className="mt-3 font-heading text-2xl font-semibold text-slate-900">{cheapestPrice === null ? "—" : `₹${cheapestPrice.toFixed(2)}`}</p><p className="mt-1 text-xs text-slate-500">Per kWh, excluding no extra fees</p></div>
        <div className="panel flex items-center gap-3 p-5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-green-50 text-green-700"><Zap size={19} /></span><p className="text-sm leading-6 text-slate-600">Purchases settle instantly with your SolarShare wallet.</p></div>
      </div>

      <div className="table-shell mt-6">
        <table className="min-w-[720px] w-full text-left text-sm">
          <thead className="table-header"><tr><th className="px-5 py-3.5">Solar seller</th><th className="px-5 py-3.5">Location</th><th className="px-5 py-3.5">Available</th><th className="px-5 py-3.5">Price</th><th className="px-5 py-3.5">Quantity</th><th className="px-5 py-3.5 text-right">Action</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {listings.map((item) => (
              <tr key={item._id} className="transition hover:bg-slate-50/70">
                <td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-green-50 text-xs font-semibold text-green-700">{item.seller?.name?.slice(0, 1)?.toUpperCase() || "S"}</span><span className="font-semibold text-slate-800">{item.seller?.name || "Solar seller"}</span></div></td>
                <td className="px-5 py-4 text-slate-600"><span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400" />{item.location?.city || item.seller?.address?.city || "Community"}</span></td>
                <td className="px-5 py-4 font-medium text-slate-800">{number(item.availableKwh).toFixed(1)} kWh</td>
                <td className="px-5 py-4 font-semibold text-slate-900">₹{number(item.pricePerKwh).toFixed(2)}<span className="font-normal text-slate-400">/kWh</span></td>
                <td className="px-5 py-4"><input aria-label="kWh quantity" className="w-24 rounded-lg border border-slate-200 px-2.5 py-2 text-sm focus:border-primary focus:ring-4 focus:ring-green-50" min="0.1" max={item.availableKwh} step="0.1" type="number" value={quantity[item._id] || 1} onChange={(e) => setQuantity({ ...quantity, [item._id]: e.target.value })} /></td>
                <td className="px-5 py-4 text-right">{user?.role === "consumer" ? <button onClick={() => buy(item)} disabled={purchasing === item._id} className="btn-primary px-3 py-2 text-xs">{purchasing === item._id ? "Buying…" : <><ShoppingBag size={14} /> Buy now</>}</button> : <span className="text-xs font-medium text-slate-400">Consumer access only</span>}</td>
              </tr>
            ))}
            {!listings.length && <tr><td colSpan="6" className="px-6 py-14 text-center"><p className="font-medium text-slate-700">No active listings yet</p><p className="mt-1 text-sm text-slate-500">When prosumers publish surplus energy, offers will appear here.</p></td></tr>}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
