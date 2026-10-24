import { useEffect, useState } from "react";
import { X } from "lucide-react";
import "./LasileMap.css";

const maps = Array.from({ length: 7 }, (_, index) => ({
  src: `/L'AsileGoogleMaps${index + 1}.png`,
  number: index + 1,
}));

export default function LasileMap({ t }) {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (selected === null) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape") setSelected(null);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  return (
    <>
      <figure className="lasile-map">
        <figcaption className="lasile-map__heading">
          <span className="lasile-map__eyebrow">{t.mapEyebrow}</span>
          <h2>{t.mapTitle}</h2>
          <p>{t.mapDescription}</p>
        </figcaption>

        <div className="lasile-map__panels">
          {maps.map(({ src, number }, index) => (
            <button
              key={src}
              type="button"
              className="lasile-map__thumbnail"
              onClick={() => setSelected(index)}
              aria-label={`${t.mapExpand} ${number}`}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>

        <a
          href="https://www.google.com/maps/search/?api=1&query=L%27Asile%2C%20Haiti"
          target="_blank"
          rel="noopener noreferrer"
          className="lasile-map__location-link"
        >
          {t.mapLink}
        </a>
      </figure>

      {selected !== null && (
        <div
          className="lasile-map__overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <div
            className="lasile-map__dialog"
            role="dialog"
            aria-modal="true"
            aria-label={`${t.mapTitle} ${maps[selected].number}`}
          >
            <button
              type="button"
              className="lasile-map__close"
              onClick={() => setSelected(null)}
              aria-label={t.mapClose}
              autoFocus
            >
              <X size={22} aria-hidden="true" />
            </button>
            <img src={maps[selected].src} alt="" />
          </div>
        </div>
      )}
    </>
  );
}
