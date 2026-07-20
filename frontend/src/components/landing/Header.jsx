import { useState } from "react";
import { Link } from "react-router-dom";
import { Sun, Menu, X } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-10">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
            <Sun size={22} className="fill-white animate-spin-slow" />
          </div>
          <span className="font-heading text-2xl font-bold tracking-tight text-slate-900">
            SolarShare
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
            How It Works
          </a>
          <Link to="/marketplace" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
            Marketplace
          </Link>
          <a href="#about" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
            About
          </a>
        </nav>

        {/* Desktop Auth Actions */}
        <div className="hidden md:flex items-center gap-5">
          <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors">
            Sign In
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex p-2 text-slate-600 hover:text-slate-900 md:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-6 py-4 md:hidden flex flex-col gap-4 shadow-inner">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-slate-600 hover:text-emerald-600 transition-colors py-1"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-slate-600 hover:text-emerald-600 transition-colors py-1"
          >
            How It Works
          </a>
          <Link
            to="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-slate-600 hover:text-emerald-600 transition-colors py-1"
          >
            Marketplace
          </Link>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-slate-600 hover:text-emerald-600 transition-colors py-1"
          >
            About
          </a>
          <div className="h-px bg-slate-100 my-1" />
          <div className="flex flex-col gap-3">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex justify-center text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors py-2"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex justify-center items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
