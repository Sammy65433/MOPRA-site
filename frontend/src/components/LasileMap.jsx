import { useEffect, useState } from "react";
import { X } from "lucide-react";
import "./LasileMap.css";

const maps = [
  { src: "/L'AsileGoogleMaps1.png", alt: "Map view 1 of L’Asile" },
  { src: "/L'AsileGoogleMaps2.png", alt: "Map view 2 of L’Asile" },
  { src: "/L'AsileGoogleMaps3.png", alt: "Map view 3 of L’Asile" },
  { src: "/L'AsileGoogleMaps4.png", alt: "Map view 4 of L’Asile" },
  { src: "/L'AsileGoogleMaps5.png", alt: "Map view 5 of L’Asile" },
  { src: "/L'AsileGoogleMaps6.png", alt: "Map view 6 of L’Asile" },
  { src: "/L'AsileGoogleMaps7.png", alt: "Map view 7 of L’Asile" },
];


export default function LasileMap() {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (selected === null) return;

    function onKeyDown(event) {
      if (event.key === "Escape") setSelected(null);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  return (
    <>
      <figure className="lasile-map">
  <div className="lasile-map__heading">
    <span className="lasile-map__eyebrow">Explore the area</span>
    <h2>Map views of L’Asile</h2>
    <p>Explore where L’Asile is located in Haiti.</p>
  </div>

  <div className="lasile-map__panels">

          {maps.map(({ src, alt }, index) => (
            <button
              key={src}
              type="button"
              className="lasile-map__thumbnail"
              onClick={() => setSelected(index)}
              aria-label={`Expand ${alt}`}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
        <figcaption>Map views of L’Asile, Haiti</figcaption>
        <a
  href="https://www.google.com/maps/search/?api=1&query=L%27Asile%2C%20Haiti"
  target="_blank"
  rel="noopener noreferrer"
  className="lasile-map__location-link"
>
  View L’Asile on Google Maps ↗
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
            aria-label={maps[selected].alt}
          >
            <button
              type="button"
              className="lasile-map__close"
              onClick={() => setSelected(null)}
              aria-label="Close expanded map"
              autoFocus
            >
              <X size={22} aria-hidden="true" />
            </button>
            <img src={maps[selected].src} alt={maps[selected].alt} />
          </div>
        </div>
      )}
    </>
  );
}
