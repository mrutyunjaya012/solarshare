import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What is SolarShare?",
    answer:
      "SolarShare is a peer-to-peer (P2P) solar energy trading platform that allows homeowners with solar panels (prosumers) to sell their surplus clean electricity directly to nearby neighbors (consumers). It creates a localized grid community that benefits both buyers and sellers.",
  },
  {
    question: "How is pricing determined?",
    answer:
      "SolarShare offers dynamic pricing based on localized supply and demand conditions, capped by regulatory limits. Alternatively, prosumers can set their own fixed prices per kWh when listing energy, ensuring complete autonomy and marketplace transparency.",
  },
  {
    question: "Are transactions secure?",
    answer:
      "Absolutely. All transactions and wallet settlements on SolarShare are protected by industry-standard encryption protocols. We record platform trades transparently on our decentralized ledger, assuring security, dispute protection, and automatic settlements.",
  },
  {
    question: "How do I earn Carbon Credits?",
    answer:
      "Our system automatically calculates your avoided CO₂ emissions based on the green energy (kWh) you generate and trade. These savings are converted into verified carbon credits, credited directly to your profile and exportable as PDF certificates.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mt-14 space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition"
              >
                <button
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-base font-bold text-slate-900">
                    {faq.question}
                  </span>
                  <span className="ml-4 shrink-0 text-slate-500">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-3 border-t border-slate-100/50 text-sm leading-relaxed text-slate-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
