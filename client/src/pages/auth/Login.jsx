import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Lock, Mail, Sun, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const roleHome = { prosumer: "/prosumer", consumer: "/consumer", admin: "/admin" };

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
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
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">
      {/* Left Column (Figma Design Layout) */}
      <section className="relative hidden overflow-hidden bg-[#0f172a] p-12 text-slate-350 lg:flex lg:flex-col lg:items-center lg:justify-center">
        {/* Glow Effects */}
        <div className="absolute right-0 top-0 -z-10 h-[300px] w-[300px] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute left-0 bottom-0 -z-10 h-[300px] w-[300px] rounded-full bg-indigo-500/5 blur-3xl" />

        <div className="flex flex-col items-center text-center">
          {/* Logo Box */}
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-600 text-white shadow-xl shadow-emerald-600/20">
            <Sun size={42} className="fill-white animate-spin-slow" />
          </div>
          <h2 className="mt-6 font-heading text-3xl font-extrabold tracking-tight text-white">
            SolarShare
          </h2>
          <p className="mt-4 max-w-sm text-sm text-slate-400 leading-relaxed">
            Join 10,000+ users trading clean solar energy in their communities.
          </p>

          {/* Stats Grid */}
          <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-sm">
            <div className="rounded-2xl bg-slate-800/40 border border-slate-800/50 p-4 text-left">
              <p className="font-heading text-xl font-bold text-white">50K+</p>
              <p className="text-[10px] font-semibold text-slate-500 uppercase mt-0.5 tracking-wider">
                Trades Done
              </p>
            </div>
            <div className="rounded-2xl bg-slate-800/40 border border-slate-800/50 p-4 text-left">
              <p className="font-heading text-xl font-bold text-white">2M kWh</p>
              <p className="text-[10px] font-semibold text-slate-500 uppercase mt-0.5 tracking-wider">
                Energy Traded
              </p>
            </div>
            <div className="rounded-2xl bg-slate-800/40 border border-slate-800/50 p-4 text-left">
              <p className="font-heading text-xl font-bold text-emerald-400">₹2Cr+</p>
              <p className="text-[10px] font-semibold text-slate-500 uppercase mt-0.5 tracking-wider">
                Revenue Paid
              </p>
            </div>
            <div className="rounded-2xl bg-slate-800/40 border border-slate-800/50 p-4 text-left">
              <p className="font-heading text-xl font-bold text-indigo-400">500T</p>
              <p className="text-[10px] font-semibold text-slate-500 uppercase mt-0.5 tracking-wider">
                CO₂ Saved
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Right Column (Sign In Form) */}
      <section className="flex min-h-screen items-center justify-center bg-white px-6 py-12 sm:px-8">
        <div className="w-full max-w-md">
          {/* Back button */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-850 mb-8 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900">
              Welcome back!
            </h1>
            <p className="mt-2 text-sm font-semibold text-slate-400">
              Sign in to your SolarShare account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Email Address */}
            <label className="block">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Email Address
              </span>
              <div className="relative mt-2">
                <Mail size={16} className="absolute left-3.5 top-[15px] text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="arjun@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 focus:outline-none"
                />
              </div>
            </label>

            {/* Password */}
            <label className="block">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Password
              </span>
              <div className="relative mt-2">
                <Lock size={16} className="absolute left-3.5 top-[15px] text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="........"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-[14px] text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            {/* Error Message */}
            {error && (
              <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
                {error}
              </p>
            )}

            {/* Checkbox and Forgot Password link */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-semibold text-slate-500">Remember me</span>
              </label>
              <a
                href="#forgot"
                className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-600/10 hover:bg-emerald-700 transition disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Create account option */}
          <p className="mt-8 text-center text-sm font-semibold text-slate-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-emerald-600 hover:text-emerald-700 transition">
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
