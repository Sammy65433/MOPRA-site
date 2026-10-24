import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { startingLanguage, translations } from "./i18n";
import Header from "./components/Header";
import Hero from "./components/Hero";
import RaffleMarquee from "./components/RaffleMarquee";
import Countdown from "./Countdown";
import Tickets from "./Tickets";
import AboutPage from "./pages/AboutPage";
import PrizesPage from "./pages/PrizePage";
import TicketsPage from "./pages/TicketsPage";
import Footer from "./components/Footer";
import "./App.css";
import LasileMap from "./components/LasileMap";


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
    <div className="min-h-screen overflow-x-hidden bg-[#05070b] text-[#f7f4e9]">
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
  <Tickets t={t} />

  <section className="lasile-map-section" aria-label="L’Asile map gallery">
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
      </Routes>
      

      <Footer t={t} />
    </div>
  );
}
