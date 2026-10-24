import { useEffect, useState } from "react";
import { X } from "lucide-react";
import "./LasileMap.css";

const maps = [
  { src: "/L'AsileGoogleMaps1.png", alt: "Map showing L’Asile in Haiti" },
  // Keep your existing image 2–7 entries here with their exact extensions.
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
