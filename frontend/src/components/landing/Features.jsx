import { Zap, Shield, Leaf, Cpu, Globe, TrendingUp } from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-28 relative">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Why Choose SolarShare?
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            The most advanced peer-to-peer energy trading platform built for the modern prosumer.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: Real-Time Trading */}
          <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-soft hover:shadow-md transition">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
              <Zap size={22} className="fill-amber-500/10" />
            </span>
            <h3 className="mt-6 font-heading text-lg font-bold text-slate-900">Real-Time Trading</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Instant P2P energy matching with live price discovery and smart contract-backed settlements.
            </p>
          </div>

          {/* Card 2: Secure & Transparent */}
          <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-soft hover:shadow-md transition">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Shield size={22} className="fill-blue-600/10" />
            </span>
            <h3 className="mt-6 font-heading text-lg font-bold text-slate-900">Secure & Transparent</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Every transaction is secured with bank-grade encryption and fully auditable on our ledger.
            </p>
          </div>

          {/* Card 3: Carbon Credits */}
          <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-soft hover:shadow-md transition">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <Leaf size={22} className="fill-green-600/10" />
            </span>
            <h3 className="mt-6 font-heading text-lg font-bold text-slate-900">Carbon Credits</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Earn and trade carbon credits for every kWh of clean solar energy you produce and sell.
            </p>
          </div>

          {/* Card 4: Dynamic Pricing */}
          <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-soft hover:shadow-md transition">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <TrendingUp size={22} />
            </span>
            <h3 className="mt-6 font-heading text-lg font-bold text-slate-900">Dynamic Pricing</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              AI-powered pricing engine maximizes your revenue based on demand, supply, and market conditions.
            </p>
          </div>

          {/* Card 5: Smart Meter Integration */}
          <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-soft hover:shadow-md transition">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Cpu size={22} />
            </span>
            <h3 className="mt-6 font-heading text-lg font-bold text-slate-900">Smart Meter Integration</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Seamless integration with your smart meter for real-time monitoring and automated settlements.
            </p>
          </div>

          {/* Card 6: Community Network */}
          <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-soft hover:shadow-md transition">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Globe size={22} />
            </span>
            <h3 className="mt-6 font-heading text-lg font-bold text-slate-900">Community Network</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Join a growing community of 10,000+ prosumers trading clean energy across major cities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
