import { HeartHandshake, MapPin, Sparkles } from "lucide-react";
import "./RaffleMarquee.css";

const messages = {
  en: [
    { Icon: MapPin, text: "L’ASILE, HAITI" },
    { Icon: HeartHandshake, text: "A COMMUNITY-FOCUSED INITIATIVE" },
    { Icon: Sparkles, text: "RAFFLE DETAILS COMING SOON" },
  ],
  fr: [
    { Icon: MapPin, text: "L’ASILE, HAÏTI" },
    { Icon: HeartHandshake, text: "UNE INITIATIVE AXÉE SUR LA COMMUNAUTÉ" },
    { Icon: Sparkles, text: "DÉTAILS DE LA TOMBOLA À VENIR" },
  ],
  ht: [
    { Icon: MapPin, text: "LAZIL, AYITI" },
    { Icon: HeartHandshake, text: "YON INISYATIV POU KOMINOTE A" },
    { Icon: Sparkles, text: "DETAY TOMBOLA A AP VINI" },
  ],
};

export default function RaffleMarquee({ language = "en" }) {
  const items = messages[language] ?? messages.en;
  const label = items.map(({ text }) => text).join(" · ");

  return (
    <div
      className="overflow-hidden border-t-2 border-t-[#1d4ed8] border-b-2 border-b-[#c6283e] bg-[#090e19] py-5"
      aria-label={label}
    >
      <div className="marquee-track flex w-max items-center">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center gap-8 pr-8"
            aria-hidden={copy === 1}
          >
            {Array.from({ length: 3 }, (_, repeat) =>
              items.map(({ Icon, text }) => (
                <span
                  key={`${repeat}-${text}`}
                  className="inline-flex shrink-0 items-center gap-3 whitespace-nowrap font-display text-2xl font-bold uppercase tracking-wide text-[#f7f4e9] sm:text-4xl"
                >
                  <Icon
                    size={22}
                    className="shrink-0 text-[#c6283e]"
                    aria-hidden="true"
                  />

                  {text}
                </span>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
