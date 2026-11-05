import { useEffect, useState } from "react";

const IMAGES = [
  "/Raffledetails_pic1.png",
  "/ticket-box.jpg",
  "/Raffledetails_pic2.png",
  "/ticket-box3.jpg",
  "/Raffledetails_pic1.png",
  "/haitian-gallery1.jpg",
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
      <div className="relative h-[384px] w-[384px] sm:h-[512px] sm:w-[512px]">
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
