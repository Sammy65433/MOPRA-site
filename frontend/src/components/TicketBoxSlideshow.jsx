import { useEffect, useState } from "react";

const IMAGES = [
  "/ticket-box.jpg",
  "/ticket-box2.jpg",
  "/ticket-box3.jpg",
  "/Raffledetails_pic1.png",
];

export default function TicketBoxSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % IMAGES.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <a href="#reserve-spot" className="shrink-0" aria-label="Reserve your spot">
      <div className="relative h-[256px] w-[256px] sm:h-[352px] sm:w-[352px]">
        {IMAGES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt="Raffle ticket box"
            className="absolute inset-0 h-full w-full rounded-xl object-contain transition-opacity duration-700"
            style={{ opacity: i === index ? 1 : 0 }}
          />
        ))}
      </div>
    </a>
  );
}
