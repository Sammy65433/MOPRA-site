import { ArrowUpRight, BadgeDollarSign, Gift, Sparkles, Ticket } from "lucide-react";
import Reveal from "./Reveal";
import "./Prizes.css";

const cards = [
  {
    image: "/jeepwrangler.jpg",
    secondaryImage: "/wrangler-jeep1.jpg",
    size: "md:col-span-7 md:row-span-2 min-h-[420px] md:min-h-[650px]",
    position: "object-[center_65%]",
  },
  {
    image: "/10kw-off-grid-solar-system.jpg",
    secondaryImage: "/10kw-off-grid-solar-system.jpg",
    size: "md:col-span-5 min-h-[310px]",
    position: "object-[center_60%]",
  },
  {
    image: "/Toro200.jpg",
    secondaryImage: "/bike1.jpg",
    size: "md:col-span-5 min-h-[310px]",
    position: "object-[center_68%]",
  },
  {
    image: "/Boxer125.webp",
    secondaryImage: "/bike2.jpg",
    size: "md:col-span-12 min-h-[340px] md:min-h-[430px]",
    position: "object-center",
  },
];

export default function Prizes({ t = {} }) {
  const reserveLabel = t.prizeReserveCta ?? "Reserve your spot · $100";

  return (
    <section id="raffle" className="scroll-mt-20 px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="prizes-header-showcase mb-8">
            <div className="prizes-header-bubble">
              <p className="prizes-header-bubble__eyebrow">
                <Sparkles size={24} aria-hidden="true" />
                <span>{t.prizes_eyebrow ?? t.raffleTag ?? "The raffle"}</span>
              </p>

              <h2 className="prizes-header-bubble__title">
                {t.prizes_title ?? t.raffleHeading ?? "Raffle prizes"}
              </h2>

              <p className="prizes-header-bubble__sub">
                {t.prizes_sub ?? t.raffleText ?? ""}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#reserve-spot" className="prizes-top-cta">
                  <Ticket size={18} aria-hidden="true" />
                  {reserveLabel}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </div>
            </div>

            <a
              href="#reserve-spot"
              className="prizes-header-cash-card group"
              aria-label={reserveLabel}
            >
              <div className="prizes-header-cash-card__img-wrap">
                <img
                  src="/cash-in-hand.jpg"
                  alt={t.cashImageAlt ?? "Cash prize alternative"}
                  loading="lazy"
                />
                <span className="prizes-header-cash-card__badge">
                  <BadgeDollarSign size={16} aria-hidden="true" />
                  {t.cashTag ?? "Cash alternatives"}
                </span>
              </div>
              <div className="prizes-header-cash-card__meta">
                <strong>$60K · $10K · $2.5K · $1.5K</strong>
                <span>{reserveLabel} ↗</span>
              </div>
            </a>
          </div>

          <p className="mb-12 max-w-3xl text-sm leading-6 text-white/80">
            {t.prizeImageDisclaimer}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {cards.map((card, index) => {
            const name =
              t.prize_name?.[index] ?? `${t.prize ?? "Prize"} ${index + 1}`;
            const place =
              t.prize_place?.[index] ?? `${t.prize ?? "Prize"} ${index + 1}`;
            const note = t.prize_note?.[index] ?? "";

            return (
              <Reveal key={card.image} className={card.size} delay={index * 0.1}>
                <a
                  href="#reserve-spot"
                  className="prize-card group relative block h-full w-full min-h-[inherit] overflow-hidden rounded-2xl border border-[#e5c77e]/35"
                >
                  <img
                    src={card.image}
                    alt={name}
                    loading="lazy"
                    className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${card.position}`}
                  />

                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#0b1326]/95 via-[#0b1326]/45 to-transparent"
                    aria-hidden="true"
                  />

                  <p className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-[#e5c77e]/80 bg-[#0f172a]/85 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-[#f7df9f] shadow-lg">
                    <Gift size={14} aria-hidden="true" />
                    {place}
                  </p>

                  <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-6 sm:p-8">
                    <div>
                      <h3 className="font-display max-w-xl text-2xl font-bold text-white sm:text-4xl">
                        {name}
                      </h3>
                      {note && (
                        <p className="mt-2 max-w-md text-base font-semibold text-[#f7df9f] sm:text-lg">
                          {note}
                        </p>
                      )}
                    </div>

                    <span className="prize-card__cta">
                      <Ticket size={16} aria-hidden="true" />
                      {reserveLabel}
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </span>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="cash-alternative">
          <a href="#reserve-spot" className="cash-alternative__image group">
            <img
              src="/cash-in-hand.jpg"
              alt={t.cashImageAlt}
              loading="lazy"
            />
          </a>
          <div className="cash-alternative__content">
            <p className="cash-alternative__tag">
              <BadgeDollarSign size={20} aria-hidden="true" />
              {t.cashTag}
            </p>
            <h3>{t.cashTitle}</h3>
            <p>{t.cashText}</p>
            <ul>
              {t.prize_place.map((place, index) => (
                <li key={place}>
                  <a href="#reserve-spot" className="cash-alternative__pill">
                    <span>{place}</span>
                    <strong>{t.cashAmounts[index]}</strong>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-7">
              <a href="#reserve-spot" className="prizes-top-cta">
                <Ticket size={18} aria-hidden="true" />
                {reserveLabel}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
