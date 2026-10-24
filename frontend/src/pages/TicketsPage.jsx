import Countdown from "../Countdown";
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
          <p className="tickets-page__disclaimer">
            Meeting preview only. Ticket and payment details are not confirmed.
          </p>
        </div>
      </div>

      <Countdown language={language} />
      <Tickets t={t} />
    </main>
  );
}
