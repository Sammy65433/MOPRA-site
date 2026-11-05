import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function RaffleStats() {
  const [stats, setStats] = useState(null);

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

  if (!stats) return null;

  return (
    <div
      className="inline-flex items-center gap-3 rounded-full border-2 border-[#93c5fd] bg-gradient-to-r from-[#2563eb] to-[#e11d48] px-8 py-4 font-display text-base font-extrabold text-white shadow-[0_14px_34px_rgba(37,99,235,0.4)] transition-transform hover:-translate-y-1 sm:text-lg"
    >
      <span>🎟️ {stats.participants} participant{stats.participants === 1 ? "" : "s"} so far</span>
      <span style={{ opacity: 0.7 }}>·</span>
      <span>{stats.ticketsSold} ticket{stats.ticketsSold === 1 ? "" : "s"} sold</span>
      {stats.winner && (
        <>
          <span style={{ opacity: 0.7 }}>·</span>
          <span>🏆 Winner: {stats.winner.ticketNumber}</span>
        </>
      )}
    </div>
  );
}
