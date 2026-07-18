import { useState } from "react";
import { ArrowLeft, ArrowRight, Building2, Leaf, ShieldCheck, Sun, UserRound } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const roleHome = { prosumer: "/prosumer", consumer: "/consumer", admin: "/admin" };
const ROLES = [
  { value: "prosumer", label: "Solar producer", desc: "I want to sell surplus solar energy.", icon: Sun },
  { value: "consumer", label: "Energy consumer", desc: "I want to buy clean energy nearby.", icon: Leaf },
  { value: "admin", label: "Grid administrator", desc: "I manage the SolarShare platform.", icon: ShieldCheck },
];

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "", city: "", capacityKw: "3", adminCode: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.role) return setError("Please choose how you will use SolarShare.");
    setError("");
    setSubmitting(true);
    try {
      const user = await register(form);
      navigate(roleHome[user.role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-5 py-8 sm:px-8 lg:py-12"><div className="mx-auto max-w-5xl"><Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"><ArrowLeft size={16} /> Back to home</Link><div className="mt-7 grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] lg:grid-cols-[0.78fr_1.22fr]"><section className="bg-slate-900 p-7 text-white sm:p-10"><Link to="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-lg font-bold">S</span><span><span className="block font-heading text-lg font-semibold">SolarShare</span><span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">Energy exchange</span></span></Link><div className="mt-12"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-green-300">Create your account</p><h1 className="mt-3 font-heading text-3xl font-semibold leading-tight">Bring your community into the clean-energy future.</h1><p className="mt-5 text-sm leading-6 text-slate-300">Choose your role now. You will get a workspace built around selling, buying, or managing local solar energy.</p></div><div className="mt-10 space-y-4 border-t border-white/10 pt-7"><p className="flex items-center gap-3 text-sm text-slate-300"><Sun size={17} className="text-green-300" /> Share surplus solar power</p><p className="flex items-center gap-3 text-sm text-slate-300"><Leaf size={17} className="text-green-300" /> Support local clean energy</p></div></section>
        <section className="p-6 sm:p-9 lg:p-10"><p className="eyebrow">Join SolarShare</p><h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-slate-950">Create your account</h2><p className="mt-2 text-sm leading-6 text-slate-500">Start with your details, then select the workspace you need.</p><form onSubmit={handleSubmit} className="mt-7 space-y-5"><div className="grid gap-5 sm:grid-cols-2"><label><span className="field-label">Full name</span><div className="relative"><UserRound size={16} className="pointer-events-none absolute left-3.5 top-[19px] text-slate-400" /><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="input-field pl-9" placeholder="Your name" /></div></label><label><span className="field-label">City</span><div className="relative"><Building2 size={16} className="pointer-events-none absolute left-3.5 top-[19px] text-slate-400" /><input required value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} className="input-field pl-9" placeholder="Your city" /></div></label></div><div className="grid gap-5 sm:grid-cols-2"><label><span className="field-label">Email address</span><input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="input-field" placeholder="you@example.com" /></label><label><span className="field-label">Password</span><input type="password" required minLength={6} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="input-field" placeholder="At least 6 characters" /></label></div><fieldset><legend className="field-label">How will you use SolarShare?</legend><div className="mt-2.5 grid gap-2.5">{ROLES.map((role) => { const Icon = role.icon; const selected = form.role === role.value; return <label key={role.value} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition ${selected ? "border-primary bg-green-50/70 ring-1 ring-primary" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}><input type="radio" name="role" value={role.value} checked={selected} onChange={(event) => setForm({ ...form, role: event.target.value })} className="sr-only" /><span className={`grid h-9 w-9 place-items-center rounded-lg ${selected ? "bg-primary text-white" : "bg-slate-100 text-slate-600"}`}><Icon size={17} /></span><span><span className="block text-sm font-semibold text-slate-800">{role.label}</span><span className="mt-0.5 block text-xs text-slate-500">{role.desc}</span></span></label>; })}</div></fieldset>{form.role === "prosumer" && <label className="block"><span className="field-label">Solar-panel capacity (kW)</span><input type="number" min="0.1" step="0.1" required value={form.capacityKw} onChange={(event) => setForm({ ...form, capacityKw: event.target.value })} className="input-field" placeholder="e.g. 3" /></label>}{form.role === "admin" && <label className="block"><span className="field-label">Admin registration code</span><input type="password" required value={form.adminCode} onChange={(event) => setForm({ ...form, adminCode: event.target.value })} className="input-field" placeholder="Enter the secure code" /></label>}{error && <p className="rounded-xl border border-red-100 bg-red-50 px-3.5 py-3 text-sm text-red-700">{error}</p>}<button type="submit" disabled={submitting} className="btn-primary w-full py-3">{submitting ? "Creating account…" : <>Create account <ArrowRight size={17} /></>}</button></form><p className="mt-6 text-center text-sm text-slate-500">Already a member? <Link to="/login" className="font-semibold text-primary hover:text-green-800">Log in</Link></p></section></div></div></div>
  );
};

export default Register;
