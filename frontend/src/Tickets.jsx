import { useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Gift,
  Mail,
  QrCode,
  Send,
  Ticket,
} from "lucide-react";
import "./components/Tickets.css";

const CLOVER_URL = "https://link.clover.com/urlshortener/CVF3dD";
const TICKET_PRICE = 100;

const gallery = [
  "/tickets-gallery1.jpg",
  "/tickets-gallery2.jpg",
  "/tickets-gallery3.jpg",
  "/haitian-gallery8.jpg",
  "/haitian-gallery6.jpg",
  "/haitian-gallery4.jpg",
];

function buildMailtoHref(reservation) {
  const total = (reservation.quantity * TICKET_PRICE).toFixed(2);
  const subject = encodeURIComponent(
    `MOPRA Grand Raffle Reservation — ${reservation.firstName} ${reservation.lastName} (${reservation.quantity} ticket${reservation.quantity > 1 ? "s" : ""})`
  );
  const body = encodeURIComponent(
    [
      "Hello MOPRA Team,",
      "",
      "I would like to reserve my spot for the Grand Raffle (December 31, 2027):",
      "",
      `First Name: ${reservation.firstName}`,
      `Last Name: ${reservation.lastName}`,
      `Email / Phone: ${reservation.contact}`,
      `Number of Tickets: ${reservation.quantity}`,
      `Total ($100 per ticket): $${total} USD`,
      `Message / Payment Note: ${reservation.message || "N/A"}`,
      "",
      `I am completing my $${total} USD payment via the official MOPRA QR code / Clover link (${CLOVER_URL}).`,
    ].join("\n")
  );
  return `mailto:Cahctca@gmail.com?subject=${subject}&body=${body}`;
}

export default function Tickets({ t }) {
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [savedReservation, setSavedReservation] = useState(null);
  const copy = t.ticketPage;
  const API_URL = import.meta.env.VITE_API_URL || "";

  const totalFormatted = (Math.max(1, quantity) * TICKET_PRICE).toFixed(2);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");

    const formData = new FormData(event.currentTarget);

    const payload = {
      firstName: String(formData.get("firstName") || "").trim(),
      lastName: String(formData.get("lastName") || "").trim(),
      contact: String(formData.get("contact") || "").trim(),
      quantity: Math.max(1, Number(formData.get("quantity")) || 1),
      message: String(formData.get("message") || "").trim(),
      paymentMethod: "clover",
    };

    setSavedReservation(payload);

    try {
      const response = await fetch(`${API_URL}/api/tickets/reserve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus(copy.reservationCreated);
      } else {
        setStatus(copy.reservationError);
      }
    } catch {
      setStatus(copy.reservationError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="tickets" className="scroll-mt-20 px-5 pt-20 pb-8 sm:px-8 sm:pt-28 sm:pb-10">
      <div className="ticket-panel relative mx-auto max-w-7xl overflow-hidden rounded-3xl border-2 border-[#e5c77e]/55 p-6 sm:p-12 lg:p-16">
        <div className="relative z-10">
          <div className="tickets-intro">
            <div>
              <p className="tickets-big-tag">
                <Ticket size={24} aria-hidden="true" />
                <span>{t.ticketTag}</span>
              </p>

              <h2 className="font-display mt-5 text-4xl font-bold leading-[1.06] tracking-tight text-white sm:text-6xl">
                {t.ticketHeading}
              </h2>

              <p className="mt-5 max-w-2xl leading-8 text-white/90">
                {t.ticketText}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#reserve-spot"
                  className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#e5c77e] to-[#f7df9f] px-6 py-3.5 text-sm font-extrabold text-[#0f172a] shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  <Ticket size={17} aria-hidden="true" />
                  {copy.reserve} · $100
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>

                <a
                  href={CLOVER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full border border-[#22c55e] bg-[#16a34a] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-[#15803d]"
                >
                  <QrCode size={17} aria-hidden="true" />
                  {copy.paymentButton}
                  <ExternalLink size={16} aria-hidden="true" />
                </a>

                <span className="inline-flex items-center gap-2.5 rounded-full border border-[#e5c77e]/45 bg-[#0f172a]/70 px-4 py-3 text-sm font-semibold text-[#f7df9f]">
                  <CalendarDays size={16} aria-hidden="true" />
                  {t.ticketButton}
                </span>
              </div>

              <p className="mt-4 text-sm font-medium text-[#f7df9f]">
                {t.dateNote}
              </p>
            </div>

            <div className="tickets-gallery" aria-label={copy.gallery}>
              {gallery.map((src) => (
                <a
                  href="#reserve-spot"
                  key={src}
                  className="tickets-gallery__link"
                  aria-label={copy.reserve}
                >
                  <img src={src} alt="" loading="lazy" />
                </a>
              ))}
            </div>
          </div>

          <div
            id="reserve-spot"
            className="mt-14 grid scroll-mt-24 gap-10 border-t border-white/20 pt-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14"
          >
            <div>
              <p className="tickets-sub-badge">
                <Gift size={22} aria-hidden="true" />
                <span>{copy.getTicket}</span>
              </p>

              <h3 className="font-display mt-4 text-4xl font-bold text-white sm:text-5xl">
                {copy.price}
              </h3>

              <p className="mt-5 max-w-xl leading-8 text-white/90">
                {copy.paymentIntro}
              </p>

              <p className="mt-4 rounded-xl border border-[#e5c77e]/60 bg-[#e5c77e]/15 p-4 text-sm font-semibold leading-6 text-[#fff4d2]">
                {copy.warning}
              </p>

              <h4 className="tickets-payment-badge mt-8">
                <CreditCard size={22} aria-hidden="true" />
                <span>{copy.waysToPay}</span>
              </h4>

              <div className="clover-payment">
                <div className="clover-payment__qr">
                  <a
                    href={CLOVER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={copy.paymentButton}
                  >
                    <img
                      src="/MOPRA-QR-CODE1.png"
                      alt={copy.qrAlt}
                      width="1545"
                      height="1999"
                    />
                  </a>
                  <p>{copy.scanQr}</p>
                </div>

                <div className="clover-payment__action">
                  <p>{copy.cloverNote}</p>
                  <a
                    href={CLOVER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="clover-payment__button"
                  >
                    <QrCode size={20} aria-hidden="true" />
                    {copy.paymentButton}
                    <ExternalLink size={18} aria-hidden="true" />
                  </a>
                </div>
              </div>

              <p className="mt-6 flex flex-wrap items-center gap-2 text-sm leading-6 text-white/90">
                <Mail size={16} className="text-[#f7df9f]" aria-hidden="true" />
                {copy.questions}
                <a
                  href="mailto:Cahctca@gmail.com"
                  className="font-bold text-[#93c5fd] underline underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#93c5fd]"
                >
                  Cahctca@gmail.com
                </a>
              </p>
            </div>

            <div className="ticket-reserve-box rounded-2xl border border-[#e5c77e]/45 p-6 sm:p-8">
              <h3 className="font-display flex items-center gap-3 text-3xl font-bold text-white">
                <Ticket
                  size={28}
                  className="shrink-0 text-[#e5c77e]"
                  aria-hidden="true"
                />
                {copy.reserve}
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/85">
                {copy.formWarning}
              </p>

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={copy.firstName} name="firstName" required />
                  <Field label={copy.lastName} name="lastName" required />
                </div>

                <Field label={copy.contact} name="contact" required />

                <div className="grid gap-4 sm:grid-cols-2 sm:items-end">
                  <div>
                    <label
                      htmlFor="ticket-quantity"
                      className="block text-sm font-semibold text-white/90"
                    >
                      {copy.quantity}
                    </label>
                    <input
                      id="ticket-quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      max="5"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.min(5, Math.max(1, Number(e.target.value) || 1))
                        )
                      }
                      required
                      className="mt-2 w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white focus:border-[#e5c77e] focus:outline-none"
                    />
                  </div>

                  <div className="rounded-xl border border-[#e5c77e]/45 bg-[#0f172a]/75 px-4 py-3">
                    <span className="block text-xs font-bold uppercase tracking-wider text-[#f7df9f]">
                      {copy.totalLabel ?? "Total to pay"}
                    </span>
                    <strong className="font-display text-2xl font-bold text-white">
                      ${totalFormatted} USD
                    </strong>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="ticket-message"
                    className="block text-sm font-semibold text-white/90"
                  >
                    {copy.message}
                  </label>
                  <textarea
                    id="ticket-message"
                    name="message"
                    rows="3"
                    className="mt-2 w-full resize-y rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white focus:border-[#e5c77e] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="ticket-submit-btn flex w-full items-center justify-center gap-2.5 rounded-xl px-6 py-4 text-base font-extrabold text-[#0f172a] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send size={18} aria-hidden="true" />
                  {copy.submit}
                </button>

                {submitting && (
                  <p role="status" className="text-sm font-medium text-white">
                    {copy.processing}
                  </p>
                )}

                {status && (
                  <div
                    role="status"
                    className="rounded-2xl border border-[#e5c77e]/60 bg-[#0f172a]/90 p-5 text-sm text-white shadow-xl"
                  >
                    <p className="flex items-start gap-2.5 font-semibold leading-6 text-[#f7df9f]">
                      <CheckCircle2
                        size={20}
                        className="mt-0.5 shrink-0 text-[#4ade80]"
                        aria-hidden="true"
                      />
                      <span>{status}</span>
                    </p>

                    {savedReservation && (
                      <div className="mt-4 space-y-3 border-t border-white/15 pt-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-white/85">
                          {copy.nextStepTitle}
                        </p>
                        <div className="flex flex-col gap-2.5">
                          <a
                            href={CLOVER_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 rounded-xl bg-[#16a34a] px-4 py-3 text-center text-sm font-bold text-white hover:bg-[#15803d]"
                          >
                            <QrCode size={17} aria-hidden="true" />
                            {copy.payNowCta} ($
                            {(savedReservation.quantity * TICKET_PRICE).toFixed(
                              2
                            )}{" "}
                            USD)
                            <ExternalLink size={15} aria-hidden="true" />
                          </a>

                          <a
                            href={buildMailtoHref(savedReservation)}
                            className="flex items-center justify-center gap-2 rounded-xl border border-[#93c5fd]/60 bg-[#1e3a8a]/70 px-4 py-3 text-center text-sm font-bold text-white hover:bg-[#1d4ed8]"
                          >
                            <Mail size={17} aria-hidden="true" />
                            {copy.sendGmailCta}
                            <ArrowUpRight size={15} aria-hidden="true" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, required = false }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-white/90">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        required={required}
        className="mt-2 w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white focus:border-[#e5c77e] focus:outline-none"
      />
    </div>
  );
}
