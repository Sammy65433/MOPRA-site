import { ArrowUpRight, HeartHandshake, Ticket } from "lucide-react";
import About from "../components/About";
import LasileMap from "../components/LasileMap";
import RaffleMarquee from "../components/RaffleMarquee";
import Tickets from "../Tickets";
import "./AboutPage.css";

export default function AboutPage({ t, language }) {
  return (
    <main id="top" className="about-page">
      <section
        className="about-page__banner"
        aria-labelledby="about-banner-heading"
      >
        <div className="about-page__banner-content">
          <div className="about-page__bubble">
            <p className="about-page__eyebrow">
              <HeartHandshake size={24} aria-hidden="true" />
              <span>{t.aboutTag}</span>
            </p>
            <h1 id="about-banner-heading" className="about-page__title">
              {t.navAbout}
            </h1>
          </div>
          <p className="about-page__description">{t.aboutText}</p>
          <div className="mt-7 flex flex-wrap gap-4">
            <a href="#reserve-spot" className="about-cta-gold">
              <Ticket size={18} aria-hidden="true" />
              {t.aboutReserveCta}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <RaffleMarquee language={language} />
      <About t={t} full />
      <RaffleMarquee language={language} />
      <Tickets t={t} />
      <section className="lasile-map-section" aria-label="L’Asile map gallery">
        <LasileMap t={t} />
      </section>
    </main>
  );
}
