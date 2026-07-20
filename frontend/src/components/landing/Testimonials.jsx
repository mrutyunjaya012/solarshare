import { Star } from "lucide-react";

const testimonials = [
  {
    initials: "RG",
    name: "Ramesh Gupta",
    role: "Prosumer, Bangalore",
    quote: "SolarShare turned my idle solar panels into a steady income stream. I earn ₹8,000 extra every month!",
  },
  {
    initials: "AN",
    name: "Anjali Nair",
    role: "Consumer, Hyderabad",
    quote: "My electricity bill dropped by 40%! The app is smooth, transparent, and the sellers are reliable.",
  },
  {
    initials: "VS",
    name: "Dr. Vivek Shah",
    role: "Prosumer, Pune",
    quote: "The carbon credit system is brilliant. I've earned 180 credits and the certificate design is premium.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            What Our Users Say
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-slate-100 bg-white p-7 shadow-soft flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600 font-medium italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="mt-8 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white shadow-md">
                  {t.initials}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                  <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
