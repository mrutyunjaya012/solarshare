export default function StatsBanner() {
  return (
    <section className="bg-[#0f172a] py-14 text-white">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
          <div>
            <p className="font-heading text-3xl sm:text-4xl font-extrabold text-white">10,000+</p>
            <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-2">Prosumers</p>
          </div>
          <div>
            <p className="font-heading text-3xl sm:text-4xl font-extrabold text-emerald-400">50,000+</p>
            <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-2">Trades Completed</p>
          </div>
          <div>
            <p className="font-heading text-3xl sm:text-4xl font-extrabold text-white">2M+ kWh</p>
            <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-2">Energy Traded</p>
          </div>
          <div>
            <p className="font-heading text-3xl sm:text-4xl font-extrabold text-emerald-400">500 tons</p>
            <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-2">CO₂ Avoided</p>
          </div>
        </div>
      </div>
    </section>
  );
}
