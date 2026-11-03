import { ArrowUpRight, Ticket } from "lucide-react";
import Countdown from "../Countdown";
import CountdownMarquee from "../components/CountdownMarquee";
import LasileMap from "../components/LasileMap";
import RaffleDetails from "../components/RaffleDetails";
import RaffleMarquee from "../components/RaffleMarquee";
import Tickets from "../Tickets";
import "./TicketsPage.css";

export default function TicketsPage({ t, language }) {
  return (
    <main className="tickets-page">
      <div className="tickets-page__banner">
        <div className="tickets-page__banner-content">
          <div className="tickets-page__bubble">
            <p className="tickets-page__eyebrow">
              <Ticket size={24} aria-hidden="true" />
              <span>{t.ticketTag}</span>
            </p>
            <h1 className="tickets-page__title">{t.navTickets}</h1>
          </div>
          <p className="tickets-page__description">{t.ticketText}</p>
          <p className="tickets-page__disclaimer">{t.ticketPage.warning}</p>
          <div className="mt-7 flex flex-wrap gap-4">
            <a href="#reserve-spot" className="prizes-top-cta">
              <Ticket size={18} aria-hidden="true" />
              {t.aboutReserveCta ?? "Get Your Ticket & Reserve Your Spot ($99.99)"}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <RaffleMarquee language={language} />
      <Countdown language={language} />
      <RaffleDetails t={t} showCta={false} />
      <Tickets t={t} />
      <CountdownMarquee language={language} />
      <section className="lasile-map-section" aria-label="L’Asile map gallery">
        <LasileMap t={t} />
      </section>
    </main>
  );
}
