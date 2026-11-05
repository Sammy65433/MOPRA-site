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
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.75rem",
        borderRadius: "9999px",
        border: "2px solid #93c5fd",
        background: "linear-gradient(90deg, #2563eb, #e11d48)",
        padding: "1rem 2rem",
        fontSize: "1.5rem",
        fontWeight: 900,
        fontFamily: "Georgia, 'Times New Roman', serif",
        color: "#ffffff",
        boxShadow: "0 14px 34px rgba(37,99,235,0.4)",
        letterSpacing: "0.5px",
        lineHeight: 1.2,
      }}
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
