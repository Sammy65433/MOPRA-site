import {
  ArrowUpRight,
  CalendarDays,
  Gift,
  Info,
  MapPin,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import "./RaffleDetails.css";

export default function RaffleDetails({
  t,
  showCta = true,
  showPrizeCta = false,
}) {
  const facts = [
    {
      Icon: CalendarDays,
      label: t.raffleDateLabel,
      value: t.raffleDate,
    },
    {
      Icon: MapPin,
      label: t.raffleLocationLabel,
      value: t.raffleLocation,
    },
    {
      Icon: Trophy,
      label: t.rafflePrizesLabel,
      value: t.rafflePrizesValue,
    },
  ];

  return (
    <section className="raffle-details" aria-labelledby="raffle-details-title">
      <Reveal className="raffle-details__inner">
        <header className="raffle-details__header">
          <p className="section-tag justify-center">
            <Gift size={17} aria-hidden="true" />
            {t.raffleTag}
          </p>
          <h2 id="raffle-details-title" className="raffle-details__title">
            {t.raffleDetailsTitle}
          </h2>
          <p className="raffle-details__intro">{t.raffleDetailsText}</p>
        </header>

        <figure className="raffle-details__flyer">
          <a
            href="/Raffledetails_pic1.png"
            target="_blank"
            rel="noreferrer"
            aria-label={t.raffleFlyerCaption}
          >
            <img src="/Raffledetails_pic1.png" alt={t.raffleFlyerAlt} />
          </a>
          <figcaption>
            <span>{t.raffleFlyerCaption}</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </figcaption>
        </figure>

        <div className="raffle-details__facts" aria-label={t.raffleFactsTitle}>
          {facts.map(({ Icon, label, value }) => (
            <div className="raffle-details__fact" key={label}>
              <Icon size={23} aria-hidden="true" />
              <div>
                <h3>{label}</h3>
                <p>{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="raffle-details__rules">
          <h3>
            <Info size={20} aria-hidden="true" />
            {t.raffleRulesTitle}
          </h3>
          <ul>
            {t.raffleRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>

        {(showCta || showPrizeCta) && (
          <div className="raffle-details__actions">
            {showCta && (
              <Link to="/tickets" className="raffle-details__cta">
                {t.raffleDetailsCta}
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            )}

            {showPrizeCta && (
              <Link
                to="/prizes#raffle"
                className="raffle-details__cta raffle-details__cta--secondary"
              >
                {t.rafflePrizesCta}
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            )}
          </div>
        )}
      </Reveal>
    </section>
  );
}
