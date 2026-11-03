import { useEffect, useState } from "react";
import { ArrowUpRight, Clock3, Gift, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import "./Countdown.css";

const DRAWING_DATE = new Date(2027, 11, 31).getTime();

const photos = [
  { src: "/wrangler-jeep1.jpg", contain: false },
  { src: "/wrangler-jeep2.jpg", contain: false },
  { src: "/jeepwrangler.jpg", contain: false },
  { src: "/10kw-off-grid-solar-system.jpg", contain: true },
  { src: "/solarpanels.jpg", contain: false },
  { src: "/bike1.jpg", contain: false },
  { src: "/bike2.jpg", contain: false },
  { src: "/Toro200.jpg", contain: false },
  { src: "/Boxer125.webp", contain: false },
];

const content = {
  en: {
    heading: "Countdown to the Grand Raffle",
    date: "December 31, 2027 · L’Asile and via Zoom",
    note: "Tickets are $99.99 USD. Click below to explore prizes or reserve your spot now.",
    action: "Explore Prizes & Reserve ($99.99)",
    gallery: "Raffle prize showcase · Click to reserve your spot",
    labels: ["Days", "Hours", "Minutes", "Seconds"],
  },
  fr: {
    heading: "Compte à rebours de la grande tombola",
    date: "31 décembre 2027 · L’Asile et sur Zoom",
    note: "Billets à 99,99 $ US. Cliquez ci-dessous pour découvrir les prix ou réserver votre place.",
    action: "Voir les prix et réserver (99,99 $ US)",
    gallery: "Vitrine des prix · Cliquez pour réserver votre place",
    labels: ["Jours", "Heures", "Minutes", "Secondes"],
  },
  ht: {
    heading: "Kont pou Gran Tombola a",
    date: "31 desanm 2027 · Lazil ak sou Zoom",
    note: "Tikè yo se $99.99 USD. Klike anba a pou wè prim yo oswa rezève plas ou kounye a.",
    action: "Gade prim yo epi rezève ($99.99)",
    gallery: "Foto prim tombola yo · Klike pou rezève plas ou",
    labels: ["Jou", "Èdtan", "Minit", "Segonn"],
  },
};

function getRemaining(target) {
  const difference = Math.max(0, target - Date.now());

  return [
    Math.floor(difference / 86_400_000),
    Math.floor((difference / 3_600_000) % 24),
    Math.floor((difference / 60_000) % 60),
    Math.floor((difference / 1_000) % 60),
  ];
}

export default function Countdown({ language = "en" }) {
  const t = content[language] ?? content.en;
  const [values, setValues] = useState(() => getRemaining(DRAWING_DATE));
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setValues(getRemaining(DRAWING_DATE));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPhotoIndex((current) => (current + 1) % photos.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  const currentPhoto = photos[photoIndex];

  return (
    <section className="draw-countdown" aria-labelledby="draw-countdown-title">
      <div className="draw-countdown__layout">
        <Link to="/prizes#raffle" className="draw-countdown__link">
          <div className="draw-countdown__inner">
            <h2 id="draw-countdown-title" className="draw-countdown__heading">
              <Clock3 size={18} aria-hidden="true" />
              {t.heading}
            </h2>

            <p className="draw-countdown__date">{t.date}</p>

            <div className="draw-countdown__clock" aria-hidden="true">
              {t.labels.map((label, index) => (
                <div className="draw-countdown__unit" key={label}>
                  <div className="draw-countdown__value">
                    {String(values[index]).padStart(2, "0")}
                  </div>
                  <span className="draw-countdown__label">{label}</span>
                </div>
              ))}
            </div>

            <p className="draw-countdown__note">{t.note}</p>

            <span className="draw-countdown__button">
              <Gift size={17} aria-hidden="true" />
              {t.action}
              <ArrowUpRight size={17} aria-hidden="true" />
            </span>
          </div>
        </Link>

        <div className="draw-countdown__photo-wrap">
          <Link
            to="/tickets#reserve-spot"
            className="draw-countdown__photo-link"
          >
            <div
              className={`draw-countdown__photo-frame ${
                currentPhoto.contain ? "draw-countdown__photo-frame--light" : ""
              }`}
            >
              <img
                key={currentPhoto.src}
                src={currentPhoto.src}
                alt=""
                className={`draw-countdown__photo ${
                  currentPhoto.contain ? "draw-countdown__photo--contain" : ""
                }`}
                loading="lazy"
              />
            </div>
            <p className="draw-countdown__photo-caption">
              <Ticket size={16} aria-hidden="true" />
              <span>{t.gallery}</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </p>
          </Link>

          <div
            className="draw-countdown__dots"
            role="tablist"
            aria-label="Select prize photo"
          >
            {photos.map((photo, idx) => (
              <button
                key={photo.src}
                type="button"
                onClick={() => setPhotoIndex(idx)}
                aria-label={`Prize photo ${idx + 1}`}
                aria-selected={idx === photoIndex}
                className={`draw-countdown__dot ${
                  idx === photoIndex ? "draw-countdown__dot--active" : ""
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
