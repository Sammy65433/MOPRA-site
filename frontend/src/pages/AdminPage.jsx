import { useState } from "react";
import { Printer, Ticket, Lock, LogOut } from "lucide-react";
import "./AdminPage.css";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function AdminPage() {
  const [token, setToken] = useState(
    () => sessionStorage.getItem("mopra-admin-token") || ""
  );
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  async function load(overrideToken) {
    const t = overrideToken ?? token;
    if (!t) {
      setError("Enter the admin token.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${API_URL}/api/admin/tickets?token=${encodeURIComponent(t)}`
      );
      if (!res.ok) {
        if (res.status === 401) {
          setError("Invalid token. Access denied.");
          setAuthed(false);
          sessionStorage.removeItem("mopra-admin-token");
        } else {
          setError(`Server error (${res.status}).`);
        }
        return;
      }
      const json = await res.json();
      setData(json);
      setAuthed(true);
      sessionStorage.setItem("mopra-admin-token", t);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    sessionStorage.removeItem("mopra-admin-token");
    setToken("");
    setAuthed(false);
    setData(null);
  }

  function printStickers() {
    if (!data?.tickets?.length) return;
    const tickets = data.tickets;
    const win = window.open("", "_blank");
    if (!win) return;
    const stickers = tickets
      .map(
        (t) => `
        <div class="sticker">
          <div class="label">MOPRA RAFFLE</div>
          <div class="number">${t.ticketNumber}</div>
          <div class="name">${t.firstName} ${t.lastName}</div>
        </div>`
      )
      .join("");
    win.document.write(`<!DOCTYPE html>
<html><head><title>Print Ticket Stickers</title>
<style>
  body { font-family: Arial, sans-serif; margin: 0; padding: 10mm; }
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8mm; }
  .sticker {
    border: 2px dashed #333;
    border-radius: 8px;
    padding: 6mm;
    text-align: center;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .label { font-size: 9pt; font-weight: bold; letter-spacing: 1px; color: #555; }
  .number { font-size: 14pt; font-weight: bold; margin: 4mm 0; font-family: monospace; }
  .name { font-size: 9pt; color: #333; }
  @media print {
    body { padding: 0; }
    .grid { gap: 6mm; }
  }
</style></head><body>
<h2 style="text-align:center;margin-bottom:10mm;">MOPRA Raffle — Ticket Stickers (${tickets.length} total)</h2>
<div class="grid">${stickers}</div>
<script>window.onload = () => { window.print(); };</script>
</body></html>`);
    win.document.close();
  }

  if (!authed) {
    return (
      <main className="admin-page">
        <div className="admin-login">
          <Lock size={32} aria-hidden="true" />
          <h1>Staff Admin</h1>
          <p>Enter the admin token to view confirmed ticket purchases.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              load();
            }}
            className="admin-login__form"
          >
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Admin token"
              className="admin-login__input"
              autoFocus
            />
            <button type="submit" disabled={loading} className="admin-login__btn">
              {loading ? "Checking..." : "Sign in"}
            </button>
          </form>
          {error && <p className="admin-login__error">{error}</p>}
        </div>
      </main>
    );
  }

  const reservations = data?.reservations || [];
  const tickets = data?.tickets || [];

  return (
    <main className="admin-page">
      <div className="admin-header">
        <h1>Confirmed Ticket Purchases</h1>
        <div className="admin-header__actions">
          <button onClick={printStickers} className="admin-btn admin-btn--print">
            <Printer size={18} aria-hidden="true" />
            Print ticket stickers ({tickets.length})
          </button>
          <button onClick={logout} className="admin-btn admin-btn--logout">
            <LogOut size={18} aria-hidden="true" />
            Sign out
          </button>
        </div>
      </div>

      <p className="admin-summary">
        {reservations.length} confirmed reservation(s) · {tickets.length} ticket(s) total
      </p>

      {reservations.length === 0 ? (
        <p className="admin-empty">No confirmed purchases yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Qty</th>
                <th>Ticket Numbers</th>
                <th>Status</th>
                <th>Paid</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r._id}>
                  <td>{r.firstName} {r.lastName}</td>
                  <td>{r.contact}</td>
                  <td>{r.quantity}</td>
                  <td className="admin-table__tickets">
                    {(r.ticketNumbers || []).map((n) => (
                      <span key={n} className="admin-ticket-chip">{n}</span>
                    ))}
                  </td>
                  <td>{r.status}</td>
                  <td>{r.paidAt ? new Date(r.paidAt).toLocaleString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
