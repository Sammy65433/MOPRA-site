import { useState } from "react";
import { Globe2, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { languages } from "../i18n";

export default function Header({ language, setLanguage, t }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: t.navHome ?? "Home" },
    { to: "/about", label: t.navAbout },
    { to: "/prizes", label: t.navPrizes },
    { to: "/#tickets", label: t.navTickets },
  ];

  function closeMenu() {
    setMenuOpen(false);

    if (location.pathname === "/" && location.hash === "#tickets") {
      document.getElementById("tickets")?.scrollIntoView();
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#05070b]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-5 sm:px-8">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-2"
          aria-label="MOPRA home"
        >
          <img src="/MOPRA-logo.png" alt="" className="h-11 w-11 object-contain" />
          <span className="font-display text-base font-bold tracking-[0.18em] text-white sm:text-xl">
            MOPRA
          </span>
        </Link>

        <nav
          className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.19em] text-white/75 md:flex"
          aria-label="Main navigation"
        >
          {links.map(({ to, label }) => (
            <Link key={to} to={to} className="hover:text-[#a6d0ff]">
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-1"
            role="group"
            aria-label="Site language"
          >
            <Globe2
              className="mx-1 hidden h-4 w-4 text-[#79b7ff] sm:block"
              aria-hidden="true"
            />
            {languages.map((option) => (
              <button
                key={option.code}
                type="button"
                onClick={() => setLanguage(option.code)}
                aria-label={option.name}
                aria-pressed={language === option.code}
                className={`rounded-full px-2 py-1.5 text-[11px] font-bold sm:px-3 ${
                  language === option.code
                    ? "bg-[#79b7ff] text-[#05070b]"
                    : "text-white/75 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-lg border border-white/20 p-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#79b7ff] md:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-white/10 bg-[#090e19] px-5 py-3 md:hidden"
        >
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={closeMenu}
              className="block border-b border-white/10 px-2 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white/85 last:border-0 hover:text-[#a6d0ff]"
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
