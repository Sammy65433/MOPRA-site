import { ArrowUpRight, Gift, Ticket } from "lucide-react";
import Countdown from "../Countdown";
import CountdownMarquee from "../components/CountdownMarquee";
import LasileMap from "../components/LasileMap";
import Prizes from "../components/Prizes";
import RaffleDetails from "../components/RaffleDetails";
import RaffleMarquee from "../components/RaffleMarquee";
import Tickets from "../Tickets";
import "./PrizePage.css";

export default function PrizesPage({ t, language }) {
  return (
    <main className="prizes-page">
      <section
        className="prizes-page__banner"
        aria-labelledby="raffle-intro-heading"
      >
        <div className="prizes-page__banner-content">
          <div className="prizes-page__bubble">
            <p className="prizes-page__eyebrow">
              <Gift size={24} aria-hidden="true" />
              <span>{t.raffleTag}</span>
            </p>
            <h1 id="raffle-intro-heading" className="prizes-page__title">
              {t.raffleHeading}
            </h1>
          </div>
          <p className="prizes-page__description">{t.raffleText}</p>
          <div className="mt-7 flex flex-wrap gap-4">
            <a href="#reserve-spot" className="prizes-top-cta">
              <Ticket size={18} aria-hidden="true" />
              {t.aboutReserveCta ?? "Get Your Ticket & Reserve Your Spot ($99.99)"}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <RaffleMarquee language={language} />
      <Countdown language={language} />
      <RaffleDetails t={t} />
      <div className="prizes-page-content">
        <Prizes t={t} />
        <Tickets t={t} />
      </div>

      <CountdownMarquee language={language} />
      <section className="lasile-map-section" aria-label="L’Asile map gallery">
        <LasileMap t={t} />
      </section>
    </main>
  );
}
