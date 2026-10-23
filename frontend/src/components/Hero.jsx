import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./Hero.css";

const photos = Array.from(
  { length: 8 },
  (_, index) => `/haitian-gallery${index + 1}.jpg`
);

function Line({ children, delay, className = "" }) {
  const reduceMotion = useReducedMotion();

  return (
    <span className="block overflow-hidden pb-[0.13em]">
      <motion.span
        className={`block ${className}`}
        initial={reduceMotion ? false : { y: "115%" }}
        animate={{ y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.95,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero({ t }) {
  const reduceMotion = useReducedMotion();
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) return undefined;

    const timer = window.setInterval(() => {
      setPhotoIndex((current) => (current + 1) % photos.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <section className="hero-stage relative flex min-h-[780px] items-center overflow-hidden pt-28 sm:min-h-screen">
      <div className="hero-grid absolute inset-0" aria-hidden="true" />
      <div
        className="hero-orb absolute right-[-19rem] top-[8rem] h-[42rem] w-[42rem] rounded-full sm:right-[-12rem]"
        aria-hidden="true"
      />
      <div className="hero-beam hero-beam-one" aria-hidden="true" />
      <div className="hero-beam hero-beam-two" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 px-5 pb-24 pt-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(340px,480px)] lg:items-center">
        <div>
          <motion.p
            className="mb-7 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-[#79b7ff] sm:text-xs"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.65 }}
          >
            <span className="h-px w-9 bg-[#79b7ff]" aria-hidden="true" />
            {t.heroEyebrow}
          </motion.p>

          <h1 className="font-display max-w-5xl text-[clamp(3.8rem,9vw,8rem)] font-bold leading-[0.9] tracking-[-0.075em]">
            <Line delay={0.15}>{t.heroOne}</Line>
            <Line delay={0.31} className="gold-type">
              {t.heroTwo}
            </Line>
          </h1>

          <motion.p
            className="mt-5 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduceMotion ? 0 : 0.55,
              duration: reduceMotion ? 0 : 0.7,
            }}
          >
            {t.heroText}
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap gap-3"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduceMotion ? 0 : 0.7,
              duration: reduceMotion ? 0 : 0.7,
            }}
          >
            <Link
              to="/about"
              className="inline-flex min-h-13 items-center gap-4 rounded-full bg-[#79b7ff] px-6 py-3 text-sm font-bold text-[#05070b] hover:bg-[#a6d0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#79b7ff]"
            >
              {t.discover}
              <ArrowDownRight size={18} aria-hidden="true" />
            </Link>

            <Link
              to="/#tickets"
              className="inline-flex min-h-13 items-center gap-4 rounded-full border border-[#79b7ff]/60 px-6 py-3 text-sm font-bold text-[#f7f4e9] hover:bg-[#79b7ff]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#79b7ff]"
            >
              {t.heroTickets}
              <ArrowDownRight size={18} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="hero-photo-wrap"
          initial={reduceMotion ? false : { opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: reduceMotion ? 0 : 0.45,
            duration: reduceMotion ? 0 : 0.8,
          }}
        >
          <div className="hero-photo-frame">
            <img
              src={photos[photoIndex]}
              alt={t.heroPhotoAlt}
              className="hero-photo"
            />
          </div>
          <p className="hero-photo-caption">{t.heroSide}</p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#79b7ff]/60 to-transparent" />
    </section>
  );
}
