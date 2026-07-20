import { Link } from "react-router-dom";
import { Sun, Twitter, Linkedin, Github, Instagram, Facebook } from "lucide-react";

const socials = [
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
];

const links = [
  {
    heading: "Platform",
    items: [
      { label: "Marketplace", to: "/marketplace", isRoute: true },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Pricing", href: "#features" },
      { label: "API Docs", href: "#features" },
    ],
  },
  {
    heading: "Company",
    items: [
      { label: "About Us", href: "#about" },
      { label: "Careers", href: "#about" },
      { label: "Blog", href: "#about" },
      { label: "Press", href: "#about" },
    ],
  },
  {
    heading: "Support",
    items: [
      { label: "Help Center", href: "#about" },
      { label: "Contact", href: "#about" },
      { label: "Community", href: "#about" },
      { label: "Privacy Policy", href: "#about" },
    ],
  },
];

export default function Footer() {
  return (
    <footer id="about" className="bg-[#0f172a] text-slate-400 pt-16 pb-8 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <Sun size={20} className="fill-white" />
              </div>
              <span className="font-heading text-2xl font-bold tracking-tight text-white">
                SolarShare
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Empowering communities with peer-to-peer solar energy trading for a greener tomorrow.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          <div className="md:col-span-7 grid grid-cols-3 gap-6">
            {links.map((col) => (
              <div key={col.heading} className="flex flex-col gap-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  {col.heading}
                </h4>
                <ul className="flex flex-col gap-2.5 text-sm">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      {item.isRoute ? (
                        <Link to={item.to} className="hover:text-white transition-colors">
                          {item.label}
                        </Link>
                      ) : (
                        <a href={item.href} className="hover:text-white transition-colors">
                          {item.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} SolarShare. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <span className="text-emerald-500">💚</span> for a greener planet
          </p>
        </div>
      </div>
    </footer>
  );
}
