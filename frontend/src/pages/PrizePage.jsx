import Countdown from "../Countdown";
import Prizes from "../components/Prizes";
import RaffleDetails from "../components/RaffleDetails";
import RaffleMarquee from "../components/RaffleMarquee";
import "./PrizePage.css";

export default function PrizesPage({ t, language }) {
  return (
    <main className="prizes-page">
      <section
        className="prizes-page__banner"
        aria-labelledby="raffle-intro-heading"
      >
        <div className="prizes-page__banner-content">
          <p className="prizes-page__eyebrow">{t.raffleTag}</p>
          <h1 id="raffle-intro-heading" className="prizes-page__title">
            {t.raffleHeading}
          </h1>
          <p className="prizes-page__description">{t.raffleText}</p>
        </div>
      </section>

      <Countdown language={language} />
      <RaffleDetails t={t} />
      <RaffleMarquee language={language} />
      <div className="prizes-page-content">
        <Prizes t={t} />
      </div>
    </main>
  );
}
