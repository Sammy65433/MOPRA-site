import { ArrowUpRight, CalendarDays, HeartHandshake, Sparkles, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import "./RaffleMarquee.css";

const messages = {
  en: [
    { Icon: CalendarDays, text: "GRAND RAFFLE · DECEMBER 31, 2027" },
    { Icon: Ticket, text: "TICKETS $100 · CLICK TO ENTER THE RAFFLE" },
    { Icon: HeartHandshake, text: "CELEBRATING 300 YEARS OF L’ASILE" },
    { Icon: Sparkles, text: "FOUR PRIZES · CASH ALTERNATIVES" },
  ],
  fr: [
    { Icon: CalendarDays, text: "GRANDE TOMBOLA · 31 DÉCEMBRE 2027" },
    { Icon: Ticket, text: "BILLETS 100 $ US · CLIQUEZ POUR PARTICIPER" },
    { Icon: HeartHandshake, text: "300 ANS DE L’ASILE EN CÉLÉBRATION" },
    { Icon: Sparkles, text: "QUATRE PRIX · OPTIONS EN ESPÈCES" },
  ],
  ht: [
    { Icon: CalendarDays, text: "GRAN TOMBOLA · 31 DESANM 2027" },
    { Icon: Ticket, text: "TIKÈ $100 · KLIKE POU PATISIPE NAN TOMBOLA A" },
    { Icon: HeartHandshake, text: "N AP SELEBRE 300 LANE LAZIL" },
    { Icon: Sparkles, text: "KAT PRIM · OPSYON LAJAN KACH" },
  ],
};

export default function RaffleMarquee({ language = "en" }) {
  const items = messages[language] ?? messages.en;
  const label = items.map(({ text }) => text).join(" · ");

  return (
    <Link
      to="/prizes#raffle"
      className="group block overflow-hidden border-t-2 border-t-[#2563eb] border-b-2 border-b-[#e11d48] bg-gradient-to-r from-[#0f1d3a] via-[#1c1632] to-[#0f1d3a] py-5 transition-colors hover:from-[#162952] hover:via-[#281b3d] hover:to-[#162952] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#e5c77e]"
      aria-label={label}
    >
      <div className="marquee-track flex w-max items-center">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center gap-8 pr-8"
            aria-hidden={copy === 1}
          >
            {Array.from({ length: 2 }, (_, repeat) =>
              items.map(({ Icon, text }) => (
                <span
                  key={`${repeat}-${text}`}
                  className="inline-flex shrink-0 items-center gap-3 whitespace-nowrap font-display text-2xl font-bold uppercase tracking-wide text-[#faf7f0] transition-colors group-hover:text-[#f7df9f] sm:text-4xl"
                >
                  <Icon
                    size={22}
                    className="shrink-0 text-[#fb7185]"
                    aria-hidden="true"
                  />
                  {text}
                  <ArrowUpRight
                    size={20}
                    className="shrink-0 text-[#79b7ff] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </span>
              )),
            )}
          </div>
        ))}
      </div>
    </Link>
  );
}
