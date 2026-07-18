import { useState } from "react";
import { ArrowLeft, ArrowRight, Leaf, LockKeyhole, Mail, Sun } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const roleHome = { prosumer: "/prosumer", consumer: "/consumer", admin: "/admin" };

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      navigate(roleHome[user.role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[0.96fr_1.04fr]">
      <section className="relative hidden overflow-hidden bg-slate-900 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14"><Link to="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-lg font-bold">S</span><span><span className="block font-heading text-lg font-semibold">SolarShare</span><span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">Energy exchange</span></span></Link><div className="max-w-md"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-green-300"><Sun size={25} /></span><h1 className="mt-7 font-heading text-4xl font-semibold leading-tight">A cleaner grid starts with your community.</h1><p className="mt-5 text-base leading-7 text-slate-300">Trade local solar energy, monitor your impact, and keep every settlement in one reliable place.</p><div className="mt-9 space-y-4 border-t border-white/10 pt-7"><p className="flex items-center gap-3 text-sm text-slate-200"><Leaf size={17} className="text-green-300" /> Community-powered energy marketplace</p><p className="flex items-center gap-3 text-sm text-slate-200"><LockKeyhole size={17} className="text-green-300" /> Secure account and wallet access</p></div></div><p className="text-xs text-slate-500">© {new Date().getFullYear()} SolarShare</p></section>
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8"><div className="w-full max-w-md"><Link to="/" className="mb-10 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 lg:hidden"><ArrowLeft size={16} /> Back to home</Link><div><p className="eyebrow">Welcome back</p><h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-slate-950">Log in to SolarShare</h1><p className="mt-2 text-sm leading-6 text-slate-500">Enter your details to access your energy workspace.</p></div><form onSubmit={handleSubmit} className="mt-8 space-y-5"><label className="block"><span className="field-label">Email address</span><div className="relative"><Mail size={16} className="pointer-events-none absolute left-3.5 top-[19px] text-slate-400" /><input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="input-field pl-9" placeholder="you@example.com" /></div></label><label className="block"><span className="field-label">Password</span><div className="relative"><LockKeyhole size={16} className="pointer-events-none absolute left-3.5 top-[19px] text-slate-400" /><input type="password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="input-field pl-9" placeholder="Enter your password" /></div></label>{error && <p className="rounded-xl border border-red-100 bg-red-50 px-3.5 py-3 text-sm text-red-700">{error}</p>}<button type="submit" disabled={submitting} className="btn-primary w-full py-3">{submitting ? "Logging in…" : <>Log in <ArrowRight size={17} /></>}</button></form><p className="mt-7 text-center text-sm text-slate-500">New to SolarShare? <Link to="/register" className="font-semibold text-primary hover:text-green-800">Create an account</Link></p></div></section>
    </div>
  );
};

export default Login;
