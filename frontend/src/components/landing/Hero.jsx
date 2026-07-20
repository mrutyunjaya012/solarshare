import { Link } from "react-router-dom";
import { ArrowRight, ShoppingCart, Sun, Check, Leaf } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-6 lg:pt-14 pb-12">
      {/* Glow Effects */}
      <div className="absolute right-0 top-0 -z-10 h-[600px] w-[600px] rounded-full bg-emerald-100/30 blur-3xl" />
      <div className="absolute left-10 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-emerald-50/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Content */}
          <div className="text-left lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live P2P Energy Trading Platform
            </div>

            <h1 className="mt-6 font-heading text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.1]">
              Trade Clean <br /> Energy <span className="text-emerald-600">with Your <br /> Community</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg text-slate-600 leading-relaxed">
              SolarShare connects homeowners with solar panels to nearby consumers. Sell your surplus energy, earn revenue, and build a sustainable future together.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/10 hover:bg-emerald-700 hover:shadow-lg transition"
              >
                Get Started Free <ArrowRight size={17} />
              </Link>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <ShoppingCart size={16} /> Explore Marketplace
              </Link>
            </div>

            {/* Inline Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-slate-100 pt-8 max-w-lg">
              <div>
                <p className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">10K+</p>
                <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Prosumers</p>
              </div>
              <div>
                <p className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">50K+</p>
                <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Trades</p>
              </div>
              <div>
                <p className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">2M+ kWh</p>
                <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Traded</p>
              </div>
            </div>
          </div>

          {/* Right Graphic Mockup */}
          <div className="relative mt-8 lg:mt-0 lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[420px] rounded-3xl bg-[#0f172a] p-6 shadow-2xl shadow-slate-900/40 text-slate-300">
              {/* Mockup Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white">
                    <Sun size={15} className="fill-white" />
                  </span>
                  <span className="font-heading text-sm font-semibold text-white">Live Dashboard</span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>

              {/* Graph Wave Graphic */}
              <div className="relative my-6 flex h-24 items-end justify-center">
                <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 300 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M0,80 C60,80 90,20 150,20 C210,20 240,80 300,80"
                    stroke="#10B981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M0,80 C60,80 90,20 150,20 C210,20 240,80 300,80 L300,90 L0,90 Z"
                    fill="url(#waveGradient)"
                    opacity="0.1"
                  />
                  <defs>
                    <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Floating Indicator on graph apex */}
                <div className="absolute top-[10px] left-[143px] flex flex-col items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-500/30" />
                </div>
              </div>

              {/* Grid metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-800/40 border border-slate-800 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Solar Output</p>
                  <p className="mt-1 font-heading text-lg font-bold text-white">5.2 kW</p>
                </div>
                <div className="rounded-2xl bg-slate-800/40 border border-slate-800 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Revenue Today</p>
                  <p className="mt-1 font-heading text-lg font-bold text-emerald-400">₹845</p>
                </div>
                <div className="rounded-2xl bg-slate-800/40 border border-slate-800 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">CO₂ Saved</p>
                  <p className="mt-1 font-heading text-lg font-bold text-indigo-400">2.4 kg</p>
                </div>
                <div className="rounded-2xl bg-slate-800/40 border border-slate-800 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Active Trades</p>
                  <p className="mt-1 font-heading text-lg font-bold text-white">3</p>
                </div>
              </div>

              {/* Floating Badge Top-Right */}
              <div className="absolute -right-6 -top-6 flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-xl shadow-slate-900/10 border border-slate-100">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <Check size={16} className="stroke-[3]" />
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-900">Trade Completed!</p>
                  <p className="text-[10px] font-semibold text-slate-500 mt-0.5">+₹245.50 earned</p>
                </div>
              </div>

              {/* Floating Badge Bottom-Left */}
              <div className="absolute -left-6 -bottom-6 flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-xl shadow-slate-900/10 border border-slate-100">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <Leaf size={16} className="fill-emerald-600/10" />
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-900">Carbon Credit</p>
                  <p className="text-[10px] font-semibold text-slate-500 mt-0.5">+2.4 CC earned</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
