import { useEffect, useState } from "react";
import { ArrowUpRight, Clock3, Gift, QrCode, Sparkles, Ticket } from "lucide-react";
import "./CountdownMarquee.css";

const DRAWING_DATE = new Date(2027, 11, 31).getTime();

function getRemaining(target) {
  const difference = Math.max(0, target - Date.now());

  return [
    Math.floor(difference / 86_400_000),
    Math.floor((difference / 3_600_000) % 24),
    Math.floor((difference / 60_000) % 60),
    Math.floor((difference / 1_000) % 60),
  ];
}

const copyByLang = {
  en: {
    countdownPrefix: "LIVE COUNTDOWN",
    units: ["d", "h", "m", "s"],
    items: [
      { Icon: Ticket, text: "RESERVE YOUR SPOT · $100 USD" },
      { Icon: Gift, text: "WIN A 2026 JEEP WRANGLER OR $60,000 CASH" },
      { Icon: QrCode, text: "SCAN MOPRA QR CODE TO PAY ONLINE" },
      { Icon: Sparkles, text: "DRAWING DEC 31, 2027 · L’ASILE & ZOOM" },
    ],
  },
  fr: {
    countdownPrefix: "COMPTE À REBOURS EN DIRECT",
    units: ["j", "h", "m", "s"],
    items: [
      { Icon: Ticket, text: "RÉSERVEZ VOTRE PLACE · 100 $ US" },
      { Icon: Gift, text: "GAGNEZ UNE JEEP WRANGLER 2026 OU 60 000 $" },
      { Icon: QrCode, text: "SCANNEZ LE CODE QR MOPRA POUR PAYER" },
      { Icon: Sparkles, text: "TIRAGE 31 DÉC. 2027 · L’ASILE ET ZOOM" },
    ],
  },
  ht: {
    countdownPrefix: "KONT AN DIRÈK",
    units: ["j", "è", "m", "s"],
    items: [
      { Icon: Ticket, text: "REZÈVE PLAS OU · $100 USD" },
      { Icon: Gift, text: "GENYEN YON JEEP WRANGLER 2026 OSWA 60 000 DOLA" },
      { Icon: QrCode, text: "SKANE KÒD QR MOPRA POU PEYE SOU ENTÈNÈT" },
      { Icon: Sparkles, text: "TIRAJ 31 DESANM 2027 · LAZIL AK ZOOM" },
    ],
  },
};

export default function CountdownMarquee({ language = "en" }) {
  const copy = copyByLang[language] ?? copyByLang.en;
  const [values, setValues] = useState(() => getRemaining(DRAWING_DATE));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setValues(getRemaining(DRAWING_DATE));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const timerText = values
    .map((val, idx) => `${String(val).padStart(2, "0")}${copy.units[idx]}`)
    .join(" : ");

  return (
    <a
      href="#reserve-spot"
      className="countdown-marquee group border-lights-bold"
      aria-label={`${copy.countdownPrefix}: ${timerText}`}
    >
      <div className="countdown-marquee__track">
        {[0, 1].map((dup) => (
          <div
            key={dup}
            className="countdown-marquee__group"
            aria-hidden={dup === 1}
          >
            {Array.from({ length: 2 }, (_, repeat) => (
              <div key={repeat} className="countdown-marquee__cycle">
                <span className="countdown-marquee__clock-pill">
                  <Clock3 size={20} aria-hidden="true" />
                  <span>{copy.countdownPrefix}:</span>
                  <strong>{timerText}</strong>
                </span>

                {copy.items.map(({ Icon, text }) => (
                  <span
                    key={`${repeat}-${text}`}
                    className="countdown-marquee__item"
                  >
                    <Icon size={21} aria-hidden="true" />
                    <span>{text}</span>
                    <ArrowUpRight size={19} aria-hidden="true" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </a>
  );
}
