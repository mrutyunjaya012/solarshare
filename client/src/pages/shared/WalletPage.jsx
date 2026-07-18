import { useEffect, useState } from "react";
import { CircleAlert, CircleDollarSign, Plus, ShieldCheck, WalletCards } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout.jsx";
import api from "../../api/axios.js";

const number = (value) => Number(value || 0);

export default function WalletPage() {
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState("500");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const load = () => api.get("/wallet").then(({ data }) => setWallet(data));

  useEffect(() => {
    load().catch(() => setNotice("Could not load wallet right now."));
  }, []);

  const topUp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setNotice("");
    try {
      await api.post("/wallet/top-up", { amount: Number(amount) });
      setNotice("Demo balance added to your wallet.");
      load();
    } catch (err) {
      setNotice(err.response?.data?.message || "Could not add balance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Wallet" subtitle="Manage your SolarShare balance and keep track of every marketplace settlement.">
      <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-2xl bg-slate-900 p-6 text-white shadow-soft sm:p-7">
          <div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-green-300"><WalletCards size={21} /></span><span className="status-pill bg-white/10 text-slate-200"><ShieldCheck size={13} /> Secure wallet</span></div>
          <p className="mt-8 text-sm font-medium text-slate-300">Available balance</p>
          <p className="mt-2 font-heading text-4xl font-semibold tracking-tight">₹{number(wallet?.balance).toFixed(2)}</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">Use your balance for local energy purchases. Seller earnings are credited here after a completed trade.</p>
        </section>

        <section className="panel p-5 sm:p-6">
          <div className="flex items-start gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-green-50 text-green-700"><Plus size={19} /></span><div><p className="eyebrow">Testing balance</p><h2 className="mt-1 font-heading text-lg font-semibold text-slate-900">Add demo funds</h2></div></div>
          <p className="mt-4 text-sm leading-6 text-slate-500">For this project, demo funds simulate the payment gateway so you can test the complete purchasing flow.</p>
          <form onSubmit={topUp} className="mt-5 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">₹</span><input aria-label="Top up amount" value={amount} onChange={(event) => setAmount(event.target.value)} type="number" min="1" max="10000" className="input-field !mt-0 pl-7" /></div><button disabled={loading} className="btn-primary">{loading ? "Adding…" : <><CircleDollarSign size={17} /> Add funds</>}</button></form>
          {notice && <div className={`mt-4 flex items-start gap-2 rounded-xl p-3 text-sm ${notice.toLowerCase().includes("added") ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-900"}`}><CircleAlert size={17} className="mt-0.5 shrink-0" />{notice}</div>}
        </section>
      </div>

      <section className="mt-6"><div className="mb-3"><p className="eyebrow">Wallet history</p><h2 className="mt-1 font-heading text-lg font-semibold text-slate-900">Recent activity</h2></div><div className="table-shell"><table className="min-w-[650px] w-full text-left text-sm"><thead className="table-header"><tr><th className="px-5 py-3.5">Type</th><th className="px-5 py-3.5">Reason</th><th className="px-5 py-3.5">Amount</th><th className="px-5 py-3.5">Date</th></tr></thead><tbody className="divide-y divide-slate-100">{wallet?.history?.length ? [...wallet.history].reverse().map((item, index) => <tr className="hover:bg-slate-50/70" key={index}><td className="px-5 py-4"><span className={`status-pill ${item.type === "credit" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"}`}>{item.type}</span></td><td className="px-5 py-4 capitalize text-slate-600">{item.reason?.replaceAll("_", " ")}</td><td className={`px-5 py-4 font-semibold ${item.type === "credit" ? "text-green-700" : "text-slate-800"}`}>{item.type === "credit" ? "+" : "−"}₹{number(item.amount).toFixed(2)}</td><td className="px-5 py-4 text-slate-500">{new Date(item.createdAt).toLocaleString()}</td></tr>) : <tr><td colSpan="4" className="px-6 py-14 text-center text-sm text-slate-500">No wallet activity yet.</td></tr>}</tbody></table></div></section>
    </DashboardLayout>
  );
}
