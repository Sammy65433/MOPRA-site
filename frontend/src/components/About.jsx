import { ArrowUpRight, HeartHandshake, Images, MapPin, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import "./About.css";

const pillarImages = [
  "/haitian-gallery4.jpg",
  "/haitian-gallery3.jpg",
  "/haitian-gallery5.jpg",
];

const communityGallery = [
  "/haitian-gallery2.jpg",
  "/haitian-gallery3.jpg",
  "/haitian-gallery4.jpg",
  "/haitian-gallery5.jpg",
  "/haitian-gallery6.jpg",
  "/haitian-gallery7.jpg",
  "/haitian-gallery8.jpg",
  "/haitian-gallery1.jpg",
];

export default function About({ t, full = false }) {
  return (
    <section
      id="about"
      className="scroll-mt-20 border-y border-white/15 px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="about-glass-box">
          <div className="about-intro grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <Reveal>
              <figure className="about-portrait max-w-lg">
                <div className="overflow-hidden rounded-3xl border-2 border-[#e5c77e]/45 bg-[#121e38]/80 p-2.5 shadow-2xl">
                  <img
                    src="/haitian-gallery2.jpg"
                    alt={t.aboutPhotoAlt}
                    className="aspect-square w-full rounded-2xl object-cover"
                  />
                </div>
                <figcaption className="mt-4 flex items-start gap-2 text-sm leading-6 text-[#faf7f0]/85">
                  <MapPin className="mt-1 shrink-0 text-[#e5c77e]" size={16} aria-hidden="true" />
                  {t.aboutPhotoCaption}
                </figcaption>
              </figure>
            </Reveal>

            <Reveal>
              <p className="section-tag">
                <HeartHandshake size={17} aria-hidden="true" />
                {t.aboutTag}
              </p>

              <h2 className="about-editorial-heading mt-5 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
                {t.aboutHeading}
              </h2>

              <p className="about-editorial-lead mt-7 max-w-2xl text-base leading-8 sm:text-lg">
                {t.aboutText}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                {!full && (
                  <Link to="/about" className="about-cta-primary">
                    {t.aboutReadMore}
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                )}
                <a href="#tickets" className="about-cta-gold">
                  <Ticket size={18} aria-hidden="true" />
                  {t.aboutReserveCta}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </div>
            </Reveal>
          </div>

          {full && (
            <div className="about-story">
              <Reveal>
                <div className="about-story__glass-panel">
                  <h3 className="about-story__title">{t.aboutStoryTitle}</h3>
                  <div className="about-story__body">
                    {t.aboutStory.map((paragraph) => (
                      <p key={paragraph.slice(0, 60)}>{paragraph}</p>
                    ))}
                  </div>

                  <div className="mt-10 flex flex-wrap items-center justify-center gap-4 border-t border-white/15 pt-8">
                    <a href="#tickets" className="about-cta-gold">
                      <Ticket size={18} aria-hidden="true" />
                      {t.aboutReserveCta}
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </a>
                    <Link to="/prizes#raffle" className="about-cta-secondary">
                      {t.rafflePrizesCta}
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div className="about-pillars">
                  <h3>{t.aboutPillarsTitle}</h3>
                  <div className="about-pillars__grid">
                    {t.aboutPillars.map((pillar, index) => (
                      <a
                        href="#tickets"
                        key={pillar.title}
                        className="about-pillar-card group"
                      >
                        <div className="about-pillar-card__media">
                          <img
                            src={pillarImages[index % pillarImages.length]}
                            alt={pillar.title}
                            loading="lazy"
                          />
                          <span className="about-pillar-card__number" aria-hidden="true">
                            0{index + 1}
                          </span>
                        </div>
                        <div className="about-pillar-card__body">
                          <h4>{pillar.title}</h4>
                          <p>{pillar.text}</p>
                          <span className="about-pillar-card__action">
                            <Ticket size={15} aria-hidden="true" />
                            {t.prizeReserveCta}
                            <ArrowUpRight size={15} aria-hidden="true" />
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div className="about-community-gallery">
                  <div className="about-community-gallery__header">
                    <div>
                      <p className="section-tag">
                        <Images size={16} aria-hidden="true" />
                        {t.aboutGalleryEyebrow}
                      </p>
                      <h3 className="about-community-gallery__title">
                        {t.aboutGalleryTitle}
                      </h3>
                      <p className="about-community-gallery__sub">
                        {t.aboutGallerySub}
                      </p>
                    </div>
                    <a href="#tickets" className="about-cta-gold">
                      <Ticket size={18} aria-hidden="true" />
                      {t.prizeReserveCta}
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </a>
                  </div>

                  <div className="about-community-gallery__grid">
                    {communityGallery.map((src, idx) => (
                      <a
                        href="#tickets"
                        key={src}
                        className="about-community-gallery__item group"
                        aria-label={`${t.prizeReserveCta} — Photo ${idx + 1}`}
                      >
                        <img src={src} alt="" loading="lazy" />
                        <span className="about-community-gallery__badge">
                          <Ticket size={13} aria-hidden="true" />
                          {t.prizeReserveCta}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
