import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Expand,
  MapPin,
  Ticket,
  X,
} from "lucide-react";
import "./LasileMap.css";

const maps = [
  { src: "/L'AsileGoogleMaps1.png", number: 1 },
  { src: "/L'AsileGoogleMaps2.png", number: 2 },
  { src: "/L'AsileGoogleMaps3.png", number: 3 },
  { src: "/L'AsileGoogleMaps4.png", number: 4 },
  { src: "/L'AsileGoogleMaps5.png", number: 5 },
  { src: "/L'AsileGoogleMaps6.png", number: 6 },
  { src: "/L'AsileGoogleMaps7.png", number: 7 },
  { src: "/LasileMap45.jpg", number: 8 },
  { src: "/LasileMap46.png", number: 9 },
];

export default function LasileMap({ t }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % maps.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selected === null) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape") setSelected(null);
      if (event.key === "ArrowRight") {
        setSelected((curr) => (curr + 1) % maps.length);
      }
      if (event.key === "ArrowLeft") {
        setSelected((curr) => (curr - 1 + maps.length) % maps.length);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  const currentMap = maps[activeIndex];

  function prevSlide() {
    setActiveIndex((curr) => (curr - 1 + maps.length) % maps.length);
  }

  function nextSlide() {
    setActiveIndex((curr) => (curr + 1) % maps.length);
  }

  return (
    <>
      <figure className="lasile-map">
        <figcaption className="lasile-map__header">
          <div className="lasile-map__heading">
            <span className="lasile-map__eyebrow">
              <MapPin size={15} aria-hidden="true" />
              {t.mapEyebrow}
            </span>
            <h2>{t.mapTitle}</h2>
            <p>{t.mapDescription}</p>
          </div>

          <div className="lasile-map__cta-group">
            <a
              href="https://www.google.com/maps/search/?api=1&query=L%27Asile%2C%20Haiti"
              target="_blank"
              rel="noopener noreferrer"
              className="lasile-map__location-link"
            >
              {t.mapLink}
            </a>
            <a href="#reserve-spot" className="lasile-map__reserve-link">
              <Ticket size={17} aria-hidden="true" />
              {t.prizeReserveCta ?? "Reserve your spot · $99.99"}
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
        </figcaption>

        <div className="lasile-map__slideshow">
          <button
            type="button"
            className="lasile-map__stage"
            onClick={() => setSelected(activeIndex)}
            aria-label={`${t.mapExpand} ${currentMap.number}`}
          >
            {maps.map(({ src, number }, index) => (
              <img
                key={src}
                src={src}
                alt={index === activeIndex ? `${t.mapTitle} ${number}` : ""}
                aria-hidden={index !== activeIndex}
                className={`lasile-map__slide ${
                  index === activeIndex ? "lasile-map__slide--active" : ""
                }`}
              />
            ))}
            <span className="lasile-map__badge">
              {currentMap.number} / {maps.length}
            </span>
            <span className="lasile-map__expand-pill">
              <Expand size={15} aria-hidden="true" />
              {t.mapExpand}
            </span>
          </button>

          <button
            type="button"
            onClick={prevSlide}
            className="lasile-map__nav lasile-map__nav--prev"
            aria-label="Previous map view"
          >
            <ChevronLeft size={26} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="lasile-map__nav lasile-map__nav--next"
            aria-label="Next map view"
          >
            <ChevronRight size={26} aria-hidden="true" />
          </button>
        </div>

        <div className="lasile-map__thumbs" role="tablist" aria-label={t.mapTitle}>
          {maps.map(({ src, number }, index) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              className={`lasile-map__thumb ${
                index === activeIndex ? "lasile-map__thumb--active" : ""
              }`}
              onClick={() => setActiveIndex(index)}
              aria-label={`${t.mapTitle} ${number}`}
            >
              <img src={src} alt="" loading="lazy" />
              <span>{number}</span>
            </button>
          ))}
        </div>
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
