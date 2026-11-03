import { useEffect, useState } from "react";
import { Clock3, Gift, Images } from "lucide-react";
import { Link } from "react-router-dom";
import "./Countdown.css";

const DRAWING_DATE = new Date(2027, 11, 31).getTime();

const photos = Array.from(
  { length: 8 },
  (_, index) => `/haitian-gallery${index + 1}.jpg`,
);

const content = {
  en: {
    heading: "Countdown to the Grand Raffle",
    date: "December 31, 2027 · L’Asile and via Zoom",
    note: "Drawing time and Zoom access information will be shared by the organizers.",
    action: "Explore the four prizes",
    gallery: "Illustrative community photos",
    labels: ["Days", "Hours", "Minutes", "Seconds"],
  },
  fr: {
    heading: "Compte à rebours de la grande tombola",
    date: "31 décembre 2027 · L’Asile et sur Zoom",
    note: "L’heure du tirage et les informations d’accès à Zoom seront communiquées par les organisateurs.",
    action: "Découvrir les quatre prix",
    gallery: "Photos d’illustration de la communauté",
    labels: ["Jours", "Heures", "Minutes", "Secondes"],
  },
  ht: {
    heading: "Kont pou Gran Tombola a",
    date: "31 desanm 2027 · Lazil ak sou Zoom",
    note: "Òganizatè yo ap pataje lè tiraj la ak enfòmasyon pou antre sou Zoom.",
    action: "Dekouvri kat prim yo",
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
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

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
