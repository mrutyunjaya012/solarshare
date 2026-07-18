import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BatteryCharging, CircleDollarSign, Leaf, Plus, Sun, Zap } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout.jsx";
import StatCard from "../../components/StatCard.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../api/axios.js";

const number = (value) => Number(value || 0);
const energy = (value) => `${number(value).toFixed(1)} kWh`;

const ProsumerDashboard = () => {
  const { user } = useAuth();
  const [latest, setLatest] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    api.get("/meter/latest").then((res) => setLatest(res.data)).catch(() => {});
    api.get("/wallet").then((res) => setWallet(res.data)).catch(() => {});
    api.get("/listings/mine").then((res) => setListings(res.data)).catch(() => {});
  }, []);

  const generation = number(latest?.generationKwh);
  const consumption = number(latest?.consumptionKwh);
  const surplus = number(latest?.surplusKwh);
  const reference = Math.max(generation, consumption, 1);
  const activeListings = useMemo(() => listings.filter((listing) => listing.status === "active"), [listings]);

  return (
    <DashboardLayout
      title={`Good morning, ${user?.name?.split(" ")[0] || "there"}`}
      subtitle="Keep an eye on your solar production and sell surplus when it is available."
      action={<Link to="/prosumer/listings" className="btn-primary"><Plus size={17} /> New listing</Link>}
    >
      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Today's generation" value={latest ? energy(generation) : "—"} sublabel="Measured by your smart meter" icon={Sun} accent="amber" />
        <StatCard label="Home consumption" value={latest ? energy(consumption) : "—"} sublabel="Energy used at home today" icon={Zap} accent="blue" />
        <StatCard label="Ready to sell" value={latest ? energy(surplus) : "—"} sublabel={`${activeListings.length} active listing${activeListings.length === 1 ? "" : "s"}`} icon={BatteryCharging} accent="green" />
        <StatCard label="Wallet balance" value={`₹${number(wallet?.balance).toFixed(2)}`} sublabel="Available for purchases or payout" icon={CircleDollarSign} accent="violet" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.85fr]">
        <section className="panel p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Live energy flow</p>
              <h2 className="mt-1 font-heading text-lg font-semibold text-slate-900">Today's solar balance</h2>
            </div>
            <span className={`status-pill ${latest ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}><span className={`h-1.5 w-1.5 rounded-full ${latest ? "bg-green-500" : "bg-slate-400"}`} />{latest ? "Meter online" : "Awaiting meter"}</span>
          </div>
          <div className="mt-7 space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm"><span className="flex items-center gap-2 font-medium text-slate-700"><Sun size={16} className="text-amber-500" /> Solar generation</span><span className="font-semibold text-slate-900">{latest ? energy(generation) : "—"}</span></div>
              <div className="h-3 overflow-hidden rounded-full bg-amber-50"><div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: latest ? `${Math.max((generation / reference) * 100, 4)}%` : "0%" }} /></div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm"><span className="flex items-center gap-2 font-medium text-slate-700"><Zap size={16} className="text-blue-500" /> Home consumption</span><span className="font-semibold text-slate-900">{latest ? energy(consumption) : "—"}</span></div>
              <div className="h-3 overflow-hidden rounded-full bg-blue-50"><div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: latest ? `${Math.max((consumption / reference) * 100, 4)}%` : "0%" }} /></div>
            </div>
          </div>
          <div className="mt-7 flex flex-col gap-3 rounded-xl border border-green-100 bg-green-50/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-sm font-semibold text-green-900">{latest ? `${energy(surplus)} is available for your neighbours` : "Your next meter reading will appear here"}</p><p className="mt-0.5 text-xs text-green-700">Readings refresh automatically from the smart meter.</p></div>
            <Link to="/prosumer/listings" className="inline-flex items-center gap-1 text-sm font-semibold text-green-800 hover:text-green-950">Manage listings <ArrowUpRight size={16} /></Link>
          </div>
        </section>

        <section className="panel p-5 sm:p-6">
          <p className="eyebrow">Your impact</p>
          <h2 className="mt-1 font-heading text-lg font-semibold text-slate-900">Community contribution</h2>
          <div className="mt-6 flex items-center gap-4 rounded-2xl bg-slate-900 p-4 text-white">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-green-300"><Leaf size={23} /></span>
            <div><p className="text-xs font-medium text-slate-300">Carbon credits earned</p><p className="mt-1 font-heading text-2xl font-semibold">{number(user?.carbonCreditsTotal).toFixed(2)}</p></div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4"><span className="text-sm text-slate-500">Active marketplace listings</span><span className="text-sm font-semibold text-slate-900">{activeListings.length}</span></div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4"><span className="text-sm text-slate-500">Solar capacity</span><span className="text-sm font-semibold text-slate-900">{user?.solarPanel?.capacityKw ? `${user.solarPanel.capacityKw} kW` : "Not set"}</span></div>
            <div className="flex items-center justify-between"><span className="text-sm text-slate-500">Area</span><span className="text-sm font-semibold text-slate-900">{user?.address?.city || "Not set"}</span></div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default ProsumerDashboard;
