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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createdReservation, setCreatedReservation] = useState(null);
  const [createForm, setCreateForm] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    quantity: "1",
    deliveryMethod: "in-person",
    paymentMethod: "phone",
    message: "",
  });

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
          setError("Invalid password. Access denied.");
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

  async function cancelReservation(id) {
    if (!window.confirm("Cancel this reservation? It will be marked as cancelled.")) return;
    try {
      const res = await fetch(
        `${API_URL}/api/admin/tickets/${id}/cancel?token=${encodeURIComponent(token)}`,
        { method: "PATCH" }
      );
      if (!res.ok) {
        setError("Failed to cancel.");
        return;
      }
      await load();
    } catch {
      setError("Could not reach the server.");
    }
  }

  async function deleteReservation(id) {
    if (!window.confirm("Permanently delete this reservation? This cannot be undone.")) return;
    try {
      const res = await fetch(
        `${API_URL}/api/admin/tickets/${id}?token=${encodeURIComponent(token)}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        setError("Failed to delete.");
        return;
      }
      await load();
    } catch {
      setError("Could not reach the server.");
    }
  }

  async function setWinner(e) {
    e.preventDefault();
    const ticketNumber = e.target.ticketNumber.value.trim();
    const name = e.target.winnerName.value.trim();
    if (!ticketNumber) return;
    try {
      const res = await fetch(
        `${API_URL}/api/admin/winner?token=${encodeURIComponent(token)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ticketNumber, name }),
        }
      );
      if (!res.ok) {
        setError("Failed to set winner.");
        return;
      }
      alert(`Winner set: ${ticketNumber}`);
      e.target.reset();
    } catch {
      setError("Could not reach the server.");
    }
  }

  async function createReservation(e) {
    e.preventDefault();
    const {
      firstName,
      lastName,
      contact,
      quantity,
      deliveryMethod,
      paymentMethod,
      message,
    } = createForm;
    if (!firstName || !lastName || !contact) {
      setCreateError("First name, last name, and contact are required.");
      return;
    }
    const qty = Math.floor(Number(quantity));
    if (!Number.isFinite(qty) || qty < 1) {
      setCreateError("Quantity must be at least 1 ticket.");
      return;
    }
    setCreateError("");
    setCreating(true);
    try {
      const res = await fetch(
        `${API_URL}/api/admin/tickets?token=${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            contact: contact.trim(),
            quantity: qty,
            message: message.trim(),
            deliveryMethod,
            paymentMethod,
          }),
        }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setCreateError(json.error || "Failed to create reservation.");
        return;
      }
      setCreatedReservation(json.reservation);
      await load();
    } catch {
      setCreateError("Could not reach the server.");
    } finally {
      setCreating(false);
    }
  }

  async function confirmPhonePayment(e) {
    e.preventDefault();
    const reservation = createdReservation;
    if (!reservation?._id) return;
    try {
      const payRes = await fetch(
        `${API_URL}/api/tickets/${reservation._id}/payment`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentMethod: createForm.paymentMethod || "phone",
            paymentReference:
              createForm.message || `Phone payment - ${new Date().toISOString()}`,
          }),
        }
      );
      const payJson = await payRes.json().catch(() => ({}));
      if (!payRes.ok) {
        setCreateError(payJson.error || "Failed to confirm payment.");
        return;
      }

      const delRes = await fetch(
        `${API_URL}/api/tickets/${reservation._id}/delivery`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            deliveryMethod: createForm.deliveryMethod || "in-person",
          }),
        }
      );
      const delJson = await delRes.json().catch(() => ({}));
      if (!delRes.ok) {
        setCreateError(delJson.error || "Failed to set delivery.");
        return;
      }

      alert(
        `Payment confirmed. Ticket issued: ${
          payJson.reservation?.ticketNumber || reservation.ticketNumber || ""
        }`
      );
      setCreatedReservation(null);
      await load();
    } catch {
      setCreateError("Could not reach the server.");
    }
  }

  if (!authed) {
    return (
      <main className="admin-page">
        <div className="admin-login">
          <Lock size={32} aria-hidden="true" />
          <h1>Staff Admin</h1>
          <p>Enter the admin password to view confirmed ticket purchases.</p>
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
              placeholder="Admin password"
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
            <Printer size={20} aria-hidden="true" />
            Print ticket stickers ({tickets.length})
          </button>
          <button onClick={logout} className="admin-btn admin-btn--logout admin-btn--logout-big">
            <LogOut size={20} aria-hidden="true" />
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr
                  key={r._id}
                  className={
                    r.status === "delivered"
                      ? "admin-row admin-row--delivered"
                      : r.status === "paid"
                      ? "admin-row admin-row--paid"
                      : "admin-row"
                  }
                >
                  <td>{r.firstName} {r.lastName}</td>
                  <td>{r.contact}</td>
                  <td>{r.quantity}</td>
                  <td className="admin-table__tickets">
                    {(r.ticketNumbers || []).map((n, idx) => {
                      const palette = [
                        "#fde047", "#38bdf8", "#fb7185", "#4ade80",
                        "#c084fc", "#fb923c", "#2dd4bf", "#f472b6",
                      ];
                      const color = palette[idx % palette.length];
                      return (
                        <span
                          key={n}
                          className="admin-ticket-chip"
                          style={{
                            color,
                            borderColor: color,
                            background: `${color}22`,
                            boxShadow: `0 0 8px ${color}55`,
                            fontSize: "0.85rem",
                            padding: "0.3rem 0.6rem",
                          }}
                        >
                          {n}
                        </span>
                      );
                    })}
                  </td>
                  <td>{r.status}</td>
                  <td>{r.paidAt ? new Date(r.paidAt).toLocaleString() : "—"}</td>
                  <td className="admin-table__actions">
                    <button
                      onClick={() => cancelReservation(r._id)}
                      className="admin-action-btn admin-action-btn--cancel"
                      title="Cancel"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => deleteReservation(r._id)}
                      className="admin-action-btn admin-action-btn--delete"
                      title="Delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <section className="admin-new-reservation">
        <div className="admin-new-reservation__header">
          <h2>Add Reservation — Phone Payment</h2>
          <button
            type="button"
            onClick={() => setShowCreateForm((v) => !v)}
            className="admin-btn admin-btn--print"
          >
            {showCreateForm ? "Close" : "Add phone payment / reservation"}
          </button>
        </div>
        <p className="admin-winner__hint">
          For raffle spots paid by phone or in person, enter the customer info below. The
          reservation is created, then confirm payment to issue the ticket.
        </p>
        {showCreateForm && (
          <form onSubmit={createReservation} className="admin-new-reservation__form">
            <input
              className="admin-login__input"
              placeholder="First name"
              value={createForm.firstName}
              onChange={(e) =>
                setCreateForm({ ...createForm, firstName: e.target.value })
              }
              required
            />
            <input
              className="admin-login__input"
              placeholder="Last name"
              value={createForm.lastName}
              onChange={(e) =>
                setCreateForm({ ...createForm, lastName: e.target.value })
              }
              required
            />
            <input
              className="admin-login__input"
              placeholder="Contact (email or phone)"
              value={createForm.contact}
              onChange={(e) =>
                setCreateForm({ ...createForm, contact: e.target.value })
              }
              required
            />
            <label className="admin-new-reservation__label">
              Tickets
              <input
                className="admin-login__input"
                type="number"
                min={1}
                max={5}
                value={createForm.quantity}
                onChange={(e) =>
                  setCreateForm({ ...createForm, quantity: e.target.value })
                }
                required
              />
            </label>
            <label className="admin-new-reservation__label">
              Delivery
              <select
                className="admin-login__input"
                value={createForm.deliveryMethod}
                onChange={(e) =>
                  setCreateForm({ ...createForm, deliveryMethod: e.target.value })
                }
              >
                <option value="digital">Digital (email + QR)</option>
                <option value="in-person">In person</option>
              </select>
            </label>
            <label className="admin-new-reservation__label">
              Payment method
              <select
                className="admin-login__input"
                value={createForm.paymentMethod}
                onChange={(e) =>
                  setCreateForm({ ...createForm, paymentMethod: e.target.value })
                }
              >
                <option value="phone">Phone</option>
                <option value="cash">Cash</option>
                <option value="zelle">Zelle</option>
                <option value="app">Cash App</option>
                <option value="bank">Bank transfer</option>
                <option value="clover">Clover</option>
              </select>
            </label>
            <input
              className="admin-login__input"
              placeholder="Message / payment reference (optional)"
              value={createForm.message}
              onChange={(e) =>
                setCreateForm({ ...createForm, message: e.target.value })
              }
            />
            <button type="submit" disabled={creating} className="admin-btn admin-btn--print">
              {creating ? "Creating..." : "Create Reservation"}
            </button>
          </form>
        )}
        {createError && <p className="admin-login__error">{createError}</p>}
        {createdReservation && (
          <div className="admin-new-reservation__created">
            <p>
              Created reservation for {createdReservation.firstName}{" "}
              {createdReservation.lastName} — {createdReservation.quantity} ticket(s). Status:{" "}
              {createdReservation.status}
            </p>
            <button
              type="button"
              onClick={confirmPhonePayment}
              className="admin-btn admin-btn--print"
            >
              Confirm Payment &amp; Issue Ticket
            </button>
            <button
              type="button"
              onClick={() => setCreatedReservation(null)}
              className="admin-action-btn"
            >
              Dismiss
            </button>
          </div>
        )}
      </section>

      <section className="admin-winner">
        <h2>Set Raffle Winner</h2>
        <p className="admin-winner__hint">
          After the drawing on December 31, 2027, enter the winning ticket number and name. It will appear on the public site.
        </p>
        <form onSubmit={setWinner} className="admin-winner__form">
          <input
            name="ticketNumber"
            placeholder="Winning ticket number (e.g. MOPRA-XXXXXX)"
            className="admin-login__input"
            required
          />
          <input
            name="winnerName"
            placeholder="Winner name (optional)"
            className="admin-login__input"
          />
          <button type="submit" className="admin-btn admin-btn--print">
            Set Winner
          </button>
        </form>
      </section>

      <div className="admin-footer">
        <button onClick={logout} className="admin-btn admin-btn--logout admin-btn--logout-big">
          <LogOut size={20} aria-hidden="true" />
          Sign out
        </button>
      </div>
    </main>
  );
}
