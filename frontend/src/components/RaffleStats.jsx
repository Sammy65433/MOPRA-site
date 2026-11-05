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
        textAlign: "center",
        padding: "1.5rem 1rem",
        color: "#f7f4e9",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0.75rem",
        alignItems: "center",
        fontSize: "1rem",
      }}
    >
      <span>🎟️ {stats.participants} participant{stats.participants === 1 ? "" : "s"} so far</span>
      <span style={{ opacity: 0.5 }}>·</span>
      <span>{stats.ticketsSold} ticket{stats.ticketsSold === 1 ? "" : "s"} sold</span>
      {stats.winner && (
        <>
          <span style={{ opacity: 0.5 }}>·</span>
          <span style={{ color: "#f7df9f", fontWeight: 700 }}>
            🏆 Winner: {stats.winner.ticketNumber}
            {stats.winner.name ? " — " + stats.winner.name : ""}
          </span>
        </>
      )}
    </div>
  );
}
