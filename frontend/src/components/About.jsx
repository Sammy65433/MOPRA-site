import Reveal from "./Reveal";
import "./About.css";

export default function About({ t }) {
  return (
    <section
      id="about"
      className="scroll-mt-20 border-y border-white/10 bg-white/[0.025] px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <Reveal>
          <figure className="max-w-lg">
            <div className="overflow-hidden rounded-3xl border border-[#79b7ff]/30 bg-[#0a0d13] p-2">
              <img
                src="/haitian-gallery2.jpg"
                alt={t.aboutPhotoAlt}
                className="aspect-square w-full rounded-2xl object-cover"
              />
            </div>
            <figcaption className="mt-3 text-sm text-white/60">
              {t.aboutPhotoCaption}
            </figcaption>
          </figure>
        </Reveal>

        <Reveal>
          <p className="section-tag">{t.aboutTag}</p>
          <h2 className="font-display mt-5 max-w-xl text-4xl font-bold leading-[1.07] tracking-tight sm:text-6xl">
            {t.aboutHeading}
          </h2>
          <p className="mt-7 max-w-xl text-base leading-8 text-white/60 sm:text-lg">
            {t.aboutText}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
