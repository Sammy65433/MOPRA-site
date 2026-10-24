import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight,
  BookOpen,
  HeartHandshake,
  MapPin,
  Ticket,
} from "lucide-react";

import { Link } from "react-router-dom";
import "./Hero.css";

const photos = [
  "/Lasilepic50.jpg",
  "/LasileMap45.jpg",
  "/LasileMap46.png",
  "/LasileMap47.jpg",
  "/Lasilepic48.jpg",
  "/Lasilepic49.jpg",
  
];

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
    <section className="hero-stage relative flex items-center overflow-hidden pt-20 sm:min-h-screen">
      <div className="hero-grid absolute inset-0" aria-hidden="true" />
      <div
        className="hero-orb absolute right-[-19rem] top-[8rem] h-[42rem] w-[42rem] rounded-full sm:right-[-12rem]"
        aria-hidden="true"
      />
      <div className="hero-beam hero-beam-one" aria-hidden="true" />
      <div className="hero-beam hero-beam-two" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 px-5 pb-12 pt-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(400px,600px)] lg:items-center">
        <div>
          <img
            src="/MOPRA-logo.png"
            alt=""
            className="mx-auto mb-4 h-24 w-24 object-contain sm:h-32 sm:w-32"
          />

          <p className="hero-organization-name mb-6 text-center text-xs font-semibold uppercase leading-relaxed tracking-[0.12em] sm:text-sm">
  {t.organizationFullName ??
    "Mouvement Patriotique pour la Renaissance de L’Asile"}
</p>


          <h1 className="hero-title max-w-5xl">
  <Line delay={0.15} className="hero-title-blue">
    {t.heroOne}
  </Line>
  <Line delay={0.31} className="hero-title-red">
    {t.heroTwo}
  </Line>
</h1>

<motion.div
  className="hero-intro"
  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    delay: reduceMotion ? 0 : 0.55,
    duration: reduceMotion ? 0 : 0.7,
  }}
>
  <HeartHandshake
    size={22}
    className="hero-intro-icon"
    aria-hidden="true"
  />
  <p>{t.heroText}</p>
</motion.div>


          <motion.div
            className="mt-6 flex flex-wrap gap-3"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduceMotion ? 0 : 0.7,
              duration: reduceMotion ? 0 : 0.7,
            }}
          >
            <Link
              to="/about"
              className="inline-flex min-h-13 items-center gap-3 rounded-full bg-[#79b7ff] px-6 py-3 text-sm font-bold text-[#05070b] hover:bg-[#a6d0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#79b7ff]"
            >
              <BookOpen size={18} aria-hidden="true" />
              {t.discover}
              <ArrowDownRight size={18} aria-hidden="true" />
            </Link>

            <Link
              to="/tickets"
              className="inline-flex min-h-13 items-center gap-3 rounded-full border border-[#79b7ff]/60 px-6 py-3 text-sm font-bold text-[#f7f4e9] hover:bg-[#79b7ff]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#79b7ff]"
            >
              <Ticket size={18} aria-hidden="true" />
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
            {photos.map((src, index) => (
              <img
                key={src}
                src={src}
                alt={index === photoIndex ? t.heroPhotoAlt : ""}
                aria-hidden={index !== photoIndex}
                className={`hero-photo-slide ${
                  index === photoIndex ? "hero-photo-slide--active" : ""
                }`}
              />
            ))}
          </div>

          <p className="hero-photo-caption flex items-center gap-2">
            <MapPin size={16} aria-hidden="true" />
            {t.heroEyebrow}
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#79b7ff]/60 to-transparent" />
    </section>
  );
}
