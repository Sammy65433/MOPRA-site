import { BadgeDollarSign, Gift, Sparkles } from "lucide-react";
import Reveal from "./Reveal";
import "./Prizes.css";

const cards = [
  {
    image: "/jeepwrangler.jpg",
    size: "md:col-span-7 md:row-span-2 min-h-[420px] md:min-h-[650px]",
    position: "object-[center_65%]",
  },
  {
    image: "/solarpanels.jpg",
    size: "md:col-span-5 min-h-[310px]",
    position: "object-[center_60%]",
  },
  {
    image: "/Toro200.jpg",
    size: "md:col-span-5 min-h-[310px]",
    position: "object-[center_68%]",
  },
  {
    image: "/Boxer125.webp",
    size: "md:col-span-12 min-h-[340px] md:min-h-[430px]",
    position: "object-center",
  },
];

export default function Prizes({ t = {} }) {
  return (
    <section id="raffle" className="scroll-mt-20 px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#d4af37] sm:text-sm">
            <Sparkles size={17} aria-hidden="true" />
            {t.prizes_eyebrow ?? t.raffleTag ?? "The raffle"}
          </p>

          <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display max-w-4xl text-4xl font-bold leading-tight tracking-tight text-[#f8f6f0] sm:text-5xl lg:text-6xl">
              {t.prizes_title ?? t.raffleHeading ?? "Raffle prizes"}
            </h2>
            <p className="max-w-sm text-sm leading-7 text-white/70 sm:text-base">
              {t.prizes_sub ?? t.raffleText ?? ""}
            </p>
          </div>

          <p className="mb-12 max-w-3xl text-sm leading-6 text-white/55">
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
                <article className="prize-card group relative h-full w-full min-h-[inherit] overflow-hidden rounded-2xl border border-white/10">
                  <img
                    src={card.image}
                    alt={name}
                    loading="lazy"
                    className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${card.position}`}
                  />

                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/5"
                    aria-hidden="true"
                  />

                  <p className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-md border border-[#d4af37]/60 bg-black/75 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#f2ce63]">
                    <Gift size={14} aria-hidden="true" />
                    {place}
                  </p>

                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <h3 className="font-display max-w-xl text-2xl font-bold text-[#f8f6f0] sm:text-4xl">
                      {name}
                    </h3>
                    {note && (
                      <p className="mt-3 max-w-md text-base font-medium text-white/85 sm:text-lg">
                        {note}
                      </p>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="cash-alternative">
          <div className="cash-alternative__image">
            <img
              src="/cash-in-hand.jpg"
              alt={t.cashImageAlt}
              loading="lazy"
            />
          </div>
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
                  <span>{place}</span>
                  <strong>{t.cashAmounts[index]}</strong>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
