import "./RaffleMarquee.css";


const messages = {
  en: "ROOTED IN HAITI · A NEW INITIATIVE · RAFFLE DETAILS COMING SOON · ",
  fr: "ANCRÉS EN HAÏTI · UNE NOUVELLE INITIATIVE · DÉTAILS DE LA TOMBOLA À VENIR · ",
  ht: "RASIN NOU ANN AYITI · YON NOUVO INISYATIV · DETAY TOMBOLA A AP VINI · ",
};

export default function RaffleMarquee({ language = "en" }) {
  const text = messages[language] ?? messages.en;

  return (
    <div
      className="overflow-hidden border-y border-[#79b7ff]/25 bg-[#090e19] py-5"
      aria-label={text.trim()}
    >
      <div className="marquee-track flex w-max items-center">
        {[0, 1].map((copy) => (
          <span
            key={copy}
            className="shrink-0 whitespace-nowrap pr-5 font-display text-2xl font-bold uppercase tracking-wide text-[#79b7ff] sm:text-4xl"
            aria-hidden={copy === 1}
          >
            {text.repeat(3)}
          </span>
        ))}
      </div>
    </div>
  );
}
