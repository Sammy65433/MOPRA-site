import { useEffect, useState } from "react";
import { Clock3, Gift, Images } from "lucide-react";
import { Link } from "react-router-dom";
import "./Countdown.css";

const DEMO_DURATION = 120 * 24 * 60 * 60 * 1000;

const photos = Array.from(
  { length: 8 },
  (_, index) => `/haitian-gallery${index + 1}.jpg`
);

const content = {
  en: {
    heading: "Demo countdown",
    note: "Demo only. This is not the raffle drawing date.",
    action: "Explore the raffle",
    gallery: "Illustrative community photos",
    labels: ["Days", "Hours", "Minutes", "Seconds"],
  },
  fr: {
    heading: "Compte à rebours de démonstration",
    note: "Démonstration uniquement. Ce n’est pas la date du tirage.",
    action: "Découvrir la tombola",
    gallery: "Photos d’illustration de la communauté",
    labels: ["Jours", "Heures", "Minutes", "Secondes"],
  },
  ht: {
    heading: "Kontaj demonstrasyon",
    note: "Demonstrasyon sèlman. Sa a se pa dat tiraj la.",
    action: "Dekouvri tombola a",
    gallery: "Foto ilistrasyon kominote a",
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
  const [target] = useState(() => Date.now() + DEMO_DURATION);
  const [values, setValues] = useState(() => getRemaining(target));
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setValues(getRemaining(target));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [target]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPhotoIndex((current) => (current + 1) % photos.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="draw-countdown" aria-labelledby="draw-countdown-title">
      <div className="draw-countdown__layout">
        <Link to="/prizes" className="draw-countdown__link">
          <div className="draw-countdown__inner">
            <h2 id="draw-countdown-title" className="draw-countdown__heading">
              <Clock3 size={18} aria-hidden="true" />
              {t.heading}
            </h2>

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
              <span aria-hidden="true">↗</span>
            </span>
          </div>
        </Link>

        <div className="draw-countdown__photo-wrap">
          <div className="draw-countdown__photo-frame">
            <img
              key={photos[photoIndex]}
              src={photos[photoIndex]}
              alt=""
              className="draw-countdown__photo"
              loading="lazy"
            />
          </div>
          <p className="draw-countdown__photo-caption">
            <Images size={16} aria-hidden="true" />
            {t.gallery}
          </p>
        </div>
      </div>
    </section>
  );
}
