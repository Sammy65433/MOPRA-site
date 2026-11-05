import { useEffect, useState } from "react";
import { ArrowUpRight, Gift, Ticket } from "lucide-react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { startingLanguage, translations } from "./i18n";
import Header from "./components/Header";
import Hero from "./components/Hero";
import RaffleMarquee from "./components/RaffleMarquee";
import CountdownMarquee from "./components/CountdownMarquee";
import Countdown from "./Countdown";
import Tickets from "./Tickets";
import HowItWorks from "./components/HowItWorks";
import RaffleStats from "./components/RaffleStats";
import TicketBoxSlideshow from "./components/TicketBoxSlideshow";
import AboutPage from "./pages/AboutPage";
import PrizesPage from "./pages/PrizePage";
import TicketsPage from "./pages/TicketsPage";
import AdminPage from "./pages/AdminPage";
import Footer from "./components/Footer";
import LasileMap from "./components/LasileMap";
import "./App.css";

function ScrollToSection() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const frame = requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  const [language, setLanguage] = useState(startingLanguage);
  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;

    try {
      localStorage.setItem("mopra-language", language);
    } catch {
      // Language selection still works for this visit.
    }
  }, [language]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#101c35] text-[#faf7f0]">
      <ScrollToSection />
      <Header language={language} setLanguage={setLanguage} t={t} />

      <Routes>
        <Route
          path="/"
          element={
            <main id="top">
              <Hero t={t} />
              <RaffleMarquee language={language} />
              <Countdown language={language} />

              <section
                className="px-5 pt-12 pb-2 sm:px-8"
                aria-label="Raffle and ticket links"
              >
                <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-5 rounded-3xl border-2 border-[#e5c77e]/65 bg-gradient-to-r from-[#142854]/90 via-[#2a183f]/90 to-[#142854]/90 px-6 py-8 shadow-[0_22px_60px_rgba(0,0,0,0.4),0_0_40px_rgba(229,199,126,0.22)] backdrop-blur-xl sm:px-10">
                  <Link
                    to="/tickets#reserve-spot"
                    className="inline-flex items-center gap-3 rounded-full border-2 border-white bg-gradient-to-r from-[#fde047] via-[#e5c77e] to-[#f59e0b] px-8 py-4 font-display text-base font-extrabold text-[#0f172a] shadow-[0_14px_34px_rgba(245,158,11,0.45)] transition-transform hover:-translate-y-1 sm:text-lg"
                  >
                    <Ticket size={22} aria-hidden="true" />
                    {t.raffleDetailsCta} · $100
                    <ArrowUpRight size={20} aria-hidden="true" />
                  </Link>

                  <Link
                    to="/prizes#raffle"
                    className="inline-flex items-center gap-3 rounded-full border-2 border-[#93c5fd] bg-gradient-to-r from-[#2563eb] to-[#e11d48] px-8 py-4 font-display text-base font-extrabold text-white shadow-[0_14px_34px_rgba(37,99,235,0.4)] transition-transform hover:-translate-y-1 sm:text-lg"
                  >
                    <Gift size={22} aria-hidden="true" />
                    {t.rafflePrizesCta}
                    <ArrowUpRight size={20} aria-hidden="true" />
                  </Link>

                  <TicketBoxSlideshow />
                  <a href="#reserve-spot" className="shrink-0">
                    <div className="border-lights-bold rounded-2xl">
                      <img
                        src="/MOPRA-QR-CODE1.png"
                        alt="MOPRA QR code to pay for raffle tickets"
                        className="h-[200px] w-[200px] rounded-xl object-contain sm:h-[260px] sm:w-[260px]"
                      />
                    </div>
                    <p className="mt-2 text-center text-xs font-semibold text-[#f7df9f] sm:text-sm">
                      Main payment method · MOPRA QR code
                    </p>
                    <p className="mt-1 text-center text-xs text-white/70 sm:text-sm">
                      Click the QR code or payment button to open the secure checkout in a new tab.
                    </p>
                    <p className="mt-1 text-center text-xs font-bold text-white sm:text-sm">
                      Pay Online · $100 USD
                    </p>
                  </a>
                  <a href="#reserve-spot" className="shrink-0">
                    <RaffleStats />
                  </a>
                  <HowItWorks t={t} compact />

                </div>
              </section>

              <Tickets t={t} />
              <CountdownMarquee language={language} />
              <section
                className="lasile-map-section"
                aria-label="L’Asile map gallery"
              >
                <LasileMap t={t} />
              </section>
            </main>
          }
        />
        <Route
          path="/about"
          element={<AboutPage t={t} language={language} />}
        />
        <Route
          path="/prizes"
          element={<PrizesPage t={t} language={language} />}
        />
        <Route
          path="/tickets"
          element={<TicketsPage t={t} language={language} />}
        />
        <Route
          path="/admin"
          element={<AdminPage />}
        />
      </Routes>

      <Footer t={t} />
    </div>
  );
}
