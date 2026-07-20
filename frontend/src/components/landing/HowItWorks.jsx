import { UserPlus, Cpu, ShoppingCart, DollarSign } from "lucide-react";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white relative">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Start trading clean energy in 4 simple steps.
          </p>
        </div>

        {/* Stepper Steps */}
        <div className="mt-20 relative">
          {/* Desktop Connector Line */}
          <div className="absolute top-[28px] left-[12%] right-[12%] hidden h-[2px] bg-slate-100 md:block" />

          <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-6 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/10 font-bold transition group-hover:scale-105 z-10">
                <UserPlus size={20} />
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 border border-white text-[10px] font-bold text-emerald-800">
                  1
                </span>
              </div>
              <h3 className="mt-6 font-heading text-base font-bold text-slate-900">Create Account</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 max-w-[200px]">
                Sign up as a Prosumer or Consumer and complete your KYC verification.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-500 bg-white text-emerald-600 shadow-md font-bold transition group-hover:scale-105 z-10">
                <Cpu size={20} />
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 border border-white text-[10px] font-bold text-emerald-800">
                  2
                </span>
              </div>
              <h3 className="mt-6 font-heading text-base font-bold text-slate-900">Connect Meter</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 max-w-[200px]">
                Link your smart meter to our platform for automated real-time monitoring.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-500 bg-white text-emerald-600 shadow-md font-bold transition group-hover:scale-105 z-10">
                <ShoppingCart size={20} />
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 border border-white text-[10px] font-bold text-emerald-800">
                  3
                </span>
              </div>
              <h3 className="mt-6 font-heading text-base font-bold text-slate-900">List or Buy</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 max-w-[200px]">
                List your surplus energy for sale or browse and purchase from nearby sellers.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-500 bg-white text-emerald-600 shadow-md font-bold transition group-hover:scale-105 z-10">
                <DollarSign size={20} />
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 border border-white text-[10px] font-bold text-emerald-800">
                  4
                </span>
              </div>
              <h3 className="mt-6 font-heading text-base font-bold text-slate-900">Earn & Settle</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 max-w-[200px]">
                Receive instant settlements, earn carbon credits, and track your impact.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
