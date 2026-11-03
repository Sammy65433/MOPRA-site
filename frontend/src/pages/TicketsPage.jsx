import Countdown from "../Countdown";
import RaffleDetails from "../components/RaffleDetails";
import Tickets from "../Tickets";
import "./TicketsPage.css";

export default function TicketsPage({ t, language }) {
  return (
    <main className="tickets-page">
      <div className="tickets-page__banner">
        <div className="tickets-page__banner-content">
          <p className="tickets-page__eyebrow">{t.ticketTag}</p>
          <h1 className="tickets-page__title">{t.navTickets}</h1>
          <p className="tickets-page__description">{t.ticketText}</p>
          <p className="tickets-page__disclaimer">{t.ticketPage.warning}</p>
        </div>
      </div>

      <Countdown language={language} />
      <RaffleDetails t={t} showCta={false} />
      <Tickets t={t} />
    </main>
  );
}
