import { ArrowUpRight, HeartHandshake, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import "./About.css";

const pillarImages = [
  { src: "/haitian-gallery4.jpg", modifier: "" },
  { src: "/Raffledetails_pic1.png", modifier: "about-pillar__image--flyer" },
  { src: "/tickets-gallery6.jpg", modifier: "" },
];

export default function About({ t, full = false }) {
  return (
    <section
      id="about"
      className="scroll-mt-20 border-y border-white/10 bg-white/[0.025] px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="about-intro mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <Reveal>
          <figure className="about-portrait max-w-lg">
            <div className="overflow-hidden rounded-3xl border border-[#79b7ff]/30 bg-[#0a0d13] p-2">
              <img
                src="/haitian-gallery2.jpg"
                alt={t.aboutPhotoAlt}
                className="aspect-square w-full rounded-2xl object-cover"
              />
            </div>
            <figcaption className="mt-4 flex items-start gap-2 text-sm leading-6 text-white/60">
              <MapPin className="mt-1 shrink-0" size={16} aria-hidden="true" />
              {t.aboutPhotoCaption}
            </figcaption>
          </figure>
        </Reveal>

        <Reveal>
          <p className="section-tag">
            <HeartHandshake size={17} aria-hidden="true" />
            {t.aboutTag}
          </p>

          <h2 className="font-display mt-5 max-w-3xl text-4xl font-bold leading-[1.07] tracking-tight sm:text-6xl">
            {t.aboutHeading}
          </h2>

          <p className="mt-7 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            {t.aboutText}
          </p>

          {!full && (
            <Link to="/about" className="about-read-more">
              {t.aboutReadMore}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          )}
        </Reveal>
      </div>

      {full && (
        <div className="about-story mx-auto max-w-7xl">
          <Reveal>
            <h3 className="about-story__title">{t.aboutStoryTitle}</h3>
            <div className="about-story__body">
              {t.aboutStory.map((paragraph) => (
                <p key={paragraph.slice(0, 60)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="about-pillars">
              <h3>{t.aboutPillarsTitle}</h3>
              <div className="about-pillars__grid">
                {t.aboutPillars.map((pillar, index) => (
                  <article key={pillar.title}>
                    <span aria-hidden="true">0{index + 1}</span>
                    <h4>{pillar.title}</h4>
                    <p>{pillar.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      )}
    </section>
  );
}
