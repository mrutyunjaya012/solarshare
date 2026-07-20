import { useEffect, useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, CircleAlert, ReceiptText } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../api/axios.js";

const number = (value) => Number(value || 0);

export default function TransactionsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api.get("/transactions/mine").then(({ data }) => setItems(data)).catch(() => setError("Could not load transactions."));
  }, []);

  const totals = useMemo(() => items.reduce((summary, item) => {
    const isBuyer = String(item.buyer?._id || item.buyer) === String(user?.id || user?._id);
    summary.energy += number(item.kwh);
    summary.value += number(item.totalAmount);
    if (isBuyer) summary.purchases += 1;
    else summary.sales += 1;
    return summary;
  }, { energy: 0, value: 0, purchases: 0, sales: 0 }), [items, user]);

  return (
    <DashboardLayout title="Transactions" subtitle="A clear record of every energy purchase and sale made through SolarShare.">
      {error && <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900"><CircleAlert size={18} className="mt-0.5 shrink-0" />{error}</div>}
      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3"><div className="panel p-5"><p className="text-sm font-medium text-slate-500">Energy traded</p><p className="mt-3 font-heading text-2xl font-semibold text-slate-900">{totals.energy.toFixed(1)} kWh</p><p className="mt-1 text-xs text-slate-500">Across all your transactions</p></div><div className="panel p-5"><p className="text-sm font-medium text-slate-500">Transaction value</p><p className="mt-3 font-heading text-2xl font-semibold text-slate-900">₹{totals.value.toFixed(2)}</p><p className="mt-1 text-xs text-slate-500">Total marketplace settlements</p></div><div className="panel p-5"><p className="text-sm font-medium text-slate-500">Trade direction</p><p className="mt-3 font-heading text-2xl font-semibold text-slate-900">{user?.role === "prosumer" ? `${totals.sales} sales` : `${totals.purchases} purchases`}</p><p className="mt-1 text-xs text-slate-500">Completed activity to date</p></div></div>
      <section className="mt-6"><div className="mb-3 flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-600"><ReceiptText size={18} /></span><div><p className="eyebrow">Settlement history</p><h2 className="mt-0.5 font-heading text-lg font-semibold text-slate-900">All transactions</h2></div></div><div className="table-shell"><table className="min-w-[760px] w-full text-left text-sm"><thead className="table-header"><tr><th className="px-5 py-3.5">Counterparty</th><th className="px-5 py-3.5">Energy</th><th className="px-5 py-3.5">Amount</th><th className="px-5 py-3.5">Status</th><th className="px-5 py-3.5">Date</th></tr></thead><tbody className="divide-y divide-slate-100">{items.map((item) => { const isBuyer = String(item.buyer?._id || item.buyer) === String(user?.id || user?._id); const person = isBuyer ? item.seller?.name : item.buyer?.name; return <tr className="hover:bg-slate-50/70" key={item._id}><td className="px-5 py-4"><span className="flex items-center gap-2.5">{isBuyer ? <ArrowDownLeft size={17} className="text-blue-600" /> : <ArrowUpRight size={17} className="text-green-600" />}<span><span className="block font-semibold text-slate-800">{person || "SolarShare member"}</span><span className="block text-xs text-slate-500">{isBuyer ? "Purchased from" : "Sold to"} this member</span></span></span></td><td className="px-5 py-4 font-medium text-slate-800">{number(item.kwh).toFixed(1)} kWh</td><td className="px-5 py-4 font-semibold text-slate-900">₹{number(item.totalAmount).toFixed(2)}</td><td className="px-5 py-4"><span className="status-pill bg-green-50 text-green-700 capitalize">{item.status}</span></td><td className="px-5 py-4 text-slate-500">{new Date(item.createdAt).toLocaleString()}</td></tr>; })}{!items.length && <tr><td colSpan="5" className="px-6 py-14 text-center"><p className="font-medium text-slate-700">No transactions yet</p><p className="mt-1 text-sm text-slate-500">Your energy purchases or sales will appear here after settlement.</p></td></tr>}</tbody></table></div></section>
    </DashboardLayout>
  );
}
