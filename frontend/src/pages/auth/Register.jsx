import { useState } from "react";
import { ArrowLeft, ArrowRight, Sun, Zap, Shield, User, Building2, Lock, Eye, EyeOff, Mail } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const roleHome = { prosumer: "/prosumer", consumer: "/consumer", admin: "/admin" };

const ROLES = [
  {
    value: "prosumer",
    label: "Prosumer",
    desc: "I have solar panels and want to sell surplus energy",
    icon: Sun,
  },
  {
    value: "consumer",
    label: "Consumer",
    desc: "I want to buy solar energy from nearby prosumers",
    icon: Zap,
  },
  {
    value: "admin",
    label: "Grid Admin",
    desc: "I manage the energy grid and platform operations",
    icon: Shield,
  },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Step 1 = details form, Step 2 = role picker
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    city: "",
    capacityKw: "3",
    adminCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* Validate step 1 fields before advancing */
  const handleContinueToRole = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.city) {
      return setError("Please fill in all fields.");
    }
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    setError("");
    setStep(2);
  };

  /* Final submit after role is confirmed */
  const handleSubmit = async () => {
    if (!form.role) return setError("Please select a role to continue.");
    setError("");
    setSubmitting(true);
    try {
      const user = await register(form);
      navigate(roleHome[user.role] || "/");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      setError(msg);
      // Only go back to Step 1 for non-role/non-admin errors (e.g. email already exists)
      const isRoleError = msg.toLowerCase().includes("admin") || msg.toLowerCase().includes("code");
      if (!isRoleError) setStep(1);
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── STEP 1: Details Form ────────────────────────── */
  if (step === 1) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <div className="rounded-3xl bg-white shadow-xl shadow-slate-200/60 border border-slate-100 px-8 py-10">
            {/* Logo */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
                <Sun size={32} className="fill-white animate-spin-slow" />
              </div>
              <h1 className="mt-5 font-heading text-2xl font-extrabold tracking-tight text-slate-900">
                Create Account
              </h1>
              <p className="mt-2 text-sm font-semibold text-slate-400">
                Join SolarShare and start trading clean energy
              </p>
            </div>

            <form onSubmit={handleContinueToRole} className="space-y-4">
              {/* Name + City */}
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</span>
                  <div className="relative mt-2">
                    <User size={15} className="absolute left-3 top-[14px] text-slate-400 pointer-events-none" />
                    <input
                      required
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 focus:outline-none"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">City</span>
                  <div className="relative mt-2">
                    <Building2 size={15} className="absolute left-3 top-[14px] text-slate-400 pointer-events-none" />
                    <input
                      required
                      placeholder="Your city"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 focus:outline-none"
                    />
                  </div>
                </label>
              </div>

              {/* Email */}
              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</span>
                <div className="relative mt-2">
                  <Mail size={15} className="absolute left-3 top-[14px] text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 focus:outline-none"
                  />
                </div>
              </label>

              {/* Password */}
              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</span>
                <div className="relative mt-2">
                  <Lock size={15} className="absolute left-3 top-[14px] text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[13px] text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </label>

              {/* Error */}
              {error && (
                <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-600/10 hover:bg-emerald-700 transition"
              >
                Continue <ArrowRight size={16} />
              </button>
            </form>

            <p className="mt-6 text-center text-xs font-semibold text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700 transition">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ─── STEP 2: Choose Your Role ────────────────────── */
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={() => { setStep(1); setError(""); }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="rounded-3xl bg-white shadow-xl shadow-slate-200/60 border border-slate-100 px-8 py-10">
          {/* Logo */}
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
              <Sun size={32} className="fill-white animate-spin-slow" />
            </div>
            <h1 className="mt-5 font-heading text-2xl font-extrabold tracking-tight text-slate-900">
              Choose Your Role
            </h1>
            <p className="mt-2 text-sm font-semibold text-slate-400">
              Select how you want to use SolarShare
            </p>
          </div>

          {/* Role Cards */}
          <div className="mt-8 space-y-3">
            {ROLES.map(({ value, label, desc, icon: Icon }) => {
              const selected = form.role === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => { setForm((f) => ({ ...f, role: value })); setError(""); }}
                  className={`w-full flex items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all ${
                    selected
                      ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                      selected
                        ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                        : "border-slate-200 bg-slate-50 text-slate-500"
                    }`}
                  >
                    <Icon size={20} />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-slate-900">{label}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{desc}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Prosumer-only: panel capacity */}
          {form.role === "prosumer" && (
            <label className="block mt-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Solar Panel Capacity (kW)</span>
              <input
                type="number"
                min="0.1"
                step="0.1"
                required
                value={form.capacityKw}
                onChange={(e) => setForm({ ...form, capacityKw: e.target.value })}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 focus:outline-none"
                placeholder="e.g. 3"
              />
            </label>
          )}

          {/* Admin-only: secret code */}
          {form.role === "admin" && (
            <label className="block mt-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Admin Registration Code</span>
              <input
                type="password"
                required
                value={form.adminCode}
                onChange={(e) => setForm({ ...form, adminCode: e.target.value })}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 focus:outline-none"
                placeholder="Enter the secure code"
              />
            </label>
          )}

          {/* Error */}
          {error && (
            <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
              {error}
            </p>
          )}

          {/* Continue / Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className={`mt-6 w-full rounded-xl py-4 text-sm font-bold text-white transition ${
              form.role && !submitting
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/10"
                : "bg-emerald-300 cursor-not-allowed"
            }`}
          >
            {submitting
              ? "Creating account…"
              : form.role
              ? `Continue as ${ROLES.find((r) => r.value === form.role)?.label} →`
              : "Continue as ..."}
          </button>

          <p className="mt-6 text-center text-xs font-semibold text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-600 hover:text-emerald-700 transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
