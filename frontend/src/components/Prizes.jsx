import { Gift, Sparkles } from "lucide-react";
import Reveal from "./Reveal";
import "./Prizes.css";

const cards = [
  {
    image: "/trip-4-2-1.jpg",
    size: "md:col-span-8 md:row-span-2 min-h-[320px] md:min-h-[560px]",
  },
  {
    image: "/gift-basket.jpg",
    size: "md:col-span-4 min-h-[260px]",
  },
  {
    image: "/cash-in-hand.jpg",
    size: "md:col-span-4 min-h-[260px]",
  },
  {
    image: "/smart-tv.jpg",
    size: "md:col-span-6 min-h-[280px]",
  },
  {
    image: "/trip-4-2-2.jpg",
    size: "md:col-span-6 min-h-[280px]",
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

          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-serif text-4xl tracking-tight text-[#f8f6f0] sm:text-5xl lg:text-6xl">
              {t.prizes_title ?? t.raffleHeading ?? "Prizes to be announced"}
            </h2>
            <p className="max-w-xs text-sm text-white/70 sm:text-base">
              {t.prizes_sub ?? t.raffleText ?? ""}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {cards.map((card, index) => {
            const name =
              t.prize_name?.[index] ?? `${t.prize ?? "Prize"} ${index + 1}`;
            const place =
              t.prize_place?.[index] ?? `${t.prize ?? "Prize"} ${index + 1}`;
            const note =
              t.prize_note?.[index] ?? t.prizePending ?? "Details coming soon";

            return (
              <Reveal key={card.image} className={card.size} delay={index * 0.1}>
                <div className="prize-card group relative h-full w-full min-h-[inherit] overflow-hidden rounded-2xl border border-white/10">
                  <img
                    src={card.image}
                    alt=""
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10"
                    aria-hidden="true"
                  />

                  <p className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-md border border-[#d4af37]/60 bg-black/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#f2ce63]">
                    <Gift size={14} aria-hidden="true" />
                    {place}
                  </p>

                  <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                    <h3 className="font-serif text-2xl text-[#f8f6f0] sm:text-4xl">
                      {name}
                    </h3>
                    {note && (
                      <p className="mt-2 max-w-sm text-sm text-white/80">
                        {note}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
