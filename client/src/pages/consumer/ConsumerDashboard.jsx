import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BatteryCharging, CircleDollarSign, ShoppingBag, Zap } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout.jsx";
import StatCard from "../../components/StatCard.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../api/axios.js";

const number = (value) => Number(value || 0);

const ConsumerDashboard = () => {
  const { user } = useAuth();
  const [latest, setLatest] = useState(null);
  const [listings, setListings] = useState([]);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    api.get("/meter/latest").then((res) => setLatest(res.data)).catch(() => {});
    api.get("/listings?sort=price_asc").then((res) => setListings(res.data.slice(0, 5))).catch(() => {});
    api.get("/wallet").then((res) => setWallet(res.data)).catch(() => {});
  }, []);

  const listedEnergy = useMemo(() => listings.reduce((total, listing) => total + number(listing.availableKwh), 0), [listings]);
  const lowestPrice = listings.length ? Math.min(...listings.map((listing) => number(listing.pricePerKwh))) : null;

  return (
    <DashboardLayout
      title={`Hello, ${user?.name?.split(" ")[0] || "there"}`}
      subtitle="Find locally generated solar energy at a price that works for you."
      action={<Link to="/marketplace" className="btn-primary"><ShoppingBag size={17} /> Browse marketplace</Link>}
    >
      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Current consumption" value={latest ? `${number(latest.consumptionKwh).toFixed(1)} kWh` : "—"} sublabel="From your latest smart meter reading" icon={Zap} accent="blue" />
        <StatCard label="Wallet balance" value={`₹${number(wallet?.balance).toFixed(2)}`} sublabel="Ready for marketplace purchases" icon={CircleDollarSign} accent="violet" />
        <StatCard label="Nearby availability" value={`${listedEnergy.toFixed(1)} kWh`} sublabel={`${listings.length} active local sellers`} icon={BatteryCharging} accent="green" />
        <StatCard label="Best listed price" value={lowestPrice === null ? "—" : `₹${lowestPrice.toFixed(2)}`} sublabel="Per kWh in the marketplace" icon={ShoppingBag} accent="amber" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="panel overflow-hidden">
          <div className="flex items-start justify-between gap-4 p-5 sm:p-6">
            <div><p className="eyebrow">Local marketplace</p><h2 className="mt-1 font-heading text-lg font-semibold text-slate-900">Lowest-priced energy nearby</h2></div>
            <Link to="/marketplace" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-green-800">See all <ArrowUpRight size={16} /></Link>
          </div>
          {listings.length ? (
            <div className="divide-y divide-slate-100 border-t border-slate-100">
              {listings.map((listing) => (
                <div key={listing._id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <div className="flex min-w-0 items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-green-50 text-green-700"><Zap size={18} /></span><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{listing.seller?.name || "Local solar seller"}</p><p className="mt-0.5 text-xs text-slate-500">{listing.location?.city || listing.seller?.address?.city || "Your community"} · {number(listing.availableKwh).toFixed(1)} kWh available</p></div></div>
                  <div className="flex items-center justify-between gap-5 sm:justify-end"><span className="text-sm font-semibold text-slate-900">₹{number(listing.pricePerKwh).toFixed(2)}<span className="font-normal text-slate-400">/kWh</span></span><Link to="/marketplace" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">View</Link></div>
                </div>
              ))}
            </div>
          ) : <div className="border-t border-slate-100 p-8 text-center"><p className="text-sm font-medium text-slate-700">No active listings yet</p><p className="mt-1 text-sm text-slate-500">Check back soon as local solar producers publish their surplus.</p></div>}
        </section>

        <section className="panel p-5 sm:p-6">
          <p className="eyebrow">Energy snapshot</p>
          <h2 className="mt-1 font-heading text-lg font-semibold text-slate-900">Your usage today</h2>
          <div className="mt-6 rounded-2xl bg-slate-900 p-5 text-white">
            <p className="text-xs font-medium text-slate-300">Latest consumption</p>
            <p className="mt-2 font-heading text-3xl font-semibold">{latest ? `${number(latest.consumptionKwh).toFixed(1)} kWh` : "—"}</p>
            <p className="mt-3 text-xs leading-5 text-slate-300">Smart meter readings sync automatically to help you shop at the right time.</p>
          </div>
          <div className="mt-6 rounded-xl border border-green-100 bg-green-50 p-4"><p className="text-sm font-semibold text-green-900">Buy clean energy, directly</p><p className="mt-1 text-xs leading-5 text-green-700">Every purchase is settled securely from your SolarShare wallet.</p><Link to="/marketplace" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-green-800 hover:text-green-950">Find energy <ArrowUpRight size={16} /></Link></div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default ConsumerDashboard;
