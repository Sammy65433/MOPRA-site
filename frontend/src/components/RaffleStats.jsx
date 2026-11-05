import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function RaffleStats() {
  const [stats, setStats] = useState(null);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/stats`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!cancelled && json) setStats(json);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!stats) return;
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % 2);
    }, 3500);
    return () => clearInterval(id);
  }, [stats]);

  if (!stats) return null;

  const slides = [
    `🎟️ ${stats.participants} participant${stats.participants === 1 ? "" : "s"} so far · ${stats.ticketsSold} ticket${stats.ticketsSold === 1 ? "" : "s"} sold`,
    "Get your tickets today 🎟️",
  ];

  return (
    <>
      <div
        className="inline-block rounded-full p-[3px]"
        style={{
          background: "conic-gradient(from 0deg, #fde047, #e11d48, #2563eb, #22c55e, #fde047)",
          animation: "borderLights 3s linear infinite",
          boxShadow: "0 0 18px rgba(229,199,126,0.6), 0 0 36px rgba(37,99,235,0.4)",
        }}
      >
        <div
          className="flex flex-wrap items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2563eb] to-[#e11d48] px-4 py-2 text-center font-bold leading-tight text-white shadow-[0_14px_34px_rgba(37,99,235,0.4)] sm:gap-3 sm:px-8 sm:py-4 sm:text-lg"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "clamp(0.9rem, 3.5vw, 1.5rem)",
            fontWeight: 900,
            letterSpacing: "0.5px",
            maxWidth: "90vw",
          }}
        >
          <span
            key={slide}
            style={{
              display: "inline-block",
              animation: "raffleSlideIn 0.4s ease",
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            {slides[slide]}
            {stats.winner && slide === 0 && (
              <>
                {" "}
                <span style={{ color: "#f7df9f" }}>· 🏆 Winner: {stats.winner.ticketNumber}</span>
              </>
            )}
          </span>
        </div>
      </div>
      <style>{`
        @keyframes borderLights {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        @keyframes raffleSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
