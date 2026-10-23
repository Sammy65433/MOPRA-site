import { useState } from "react";
import { CalendarDays, Ticket } from "lucide-react";
import "./components/Tickets.css";

const gallery = Array.from(
  { length: 6 },
  (_, index) => `/tickets-gallery${index + 1}.jpg`
);

const paymentMethods = [
  ["Zelle", "payments@mopra.org"],
  ["Cash App", "$MOPRA300"],
  ["Bank transfer", "Account details on request"],
];

export default function Tickets({ t }) {
  const [status, setStatus] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setStatus("Demo only. Your reservation was not sent.");
  }

  return (
    <section id="tickets" className="scroll-mt-20 px-5 py-24 sm:px-8 sm:py-32">
      <div className="ticket-panel relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-[#e5c77e]/25 p-8 sm:p-14 lg:p-20">
        <div className="relative z-10">
          <div className="tickets-intro">
            <div>
              <p className="section-tag">
                <Ticket size={16} aria-hidden="true" />
                {t.ticketTag}
              </p>

              <h2 className="font-display mt-6 text-4xl font-bold leading-[1.06] tracking-tight sm:text-6xl">
                {t.ticketHeading}
              </h2>

              <p className="mt-6 max-w-2xl leading-8 text-white/70">
                {t.ticketText}
              </p>

              <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/25 px-5 py-3 text-sm text-white/80">
                <CalendarDays
                  size={17}
                  className="text-[#e5c77e]"
                  aria-hidden="true"
                />
                {t.ticketButton}
              </div>

              <p className="mt-5 text-sm text-white/70">{t.dateNote}</p>
            </div>

            <div
              className="tickets-gallery"
              aria-label="Illustrative photo gallery"
            >
              {gallery.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt={`Illustrative gallery photo ${index + 1}`}
                  loading="lazy"
                />
              ))}
            </div>
          </div>

          <div className="mt-16 grid gap-12 border-t border-white/15 pt-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#e5c77e]">
                Get Your Ticket
              </p>

              <h3 className="font-display mt-5 text-4xl font-bold text-[#f8f6f0] sm:text-5xl">
                One ticket. <span className="text-[#e5c77e]">$100.</span>
              </h3>

              <p className="mt-6 max-w-md leading-8 text-white/70">
                Pay by Zelle, Cash App, or bank transfer, then send us your
                details with the form so we can reserve your numbers and confirm
                your entry.
              </p>

              <p className="mt-4 rounded-lg border border-[#e5c77e]/40 bg-[#e5c77e]/10 p-4 text-sm font-semibold leading-6 text-[#f7df9f]">
                Meeting preview only. Price, payment accounts, and ticket
                process require client confirmation. Do not send payment.
              </p>

              <h4 className="mt-10 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
                Ways to pay
              </h4>

              <dl className="mt-5 space-y-3">
                {paymentMethods.map(([method, details]) => (
                  <div
                    key={method}
                    className="flex flex-wrap justify-between gap-2 rounded-xl border border-white/15 bg-black/20 px-5 py-4"
                  >
                    <dt className="font-semibold text-[#f8f6f0]">
                      {method}
                    </dt>
                    <dd className="break-all text-white/70">{details}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-6 text-sm leading-6 text-white/75">
                Questions? Email{" "}
                <a
                  href="mailto:Cahctca@gmail.com"
                  className="font-semibold text-[#a6d0ff] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#79b7ff]"
                >
                  Cahctca@gmail.com
                </a>
                .
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-black/20 p-6 sm:p-8">
              <h3 className="font-display text-3xl font-bold text-[#f8f6f0]">
                Reserve your spot
              </h3>

              <p className="mt-3 text-sm text-white/70">
                Demo form only. Do not enter real personal information.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="First name" name="firstName" required />
                  <Field label="Last name" name="lastName" required />
                </div>

                <Field label="Email or phone" name="contact" required />

                <div>
                  <label
                    htmlFor="ticket-quantity"
                    className="block text-sm text-white/80"
                  >
                    Number of tickets
                  </label>
                  <input
                    id="ticket-quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    defaultValue="1"
                    required
                    className="mt-2 w-full rounded-lg border border-white/25 bg-white/5 px-4 py-3 text-white focus:border-[#e5c77e] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="ticket-message"
                    className="block text-sm text-white/80"
                  >
                    Message (optional)
                  </label>
                  <textarea
                    id="ticket-message"
                    name="message"
                    rows="3"
                    className="mt-2 w-full resize-y rounded-lg border border-white/25 bg-white/5 px-4 py-3 text-white focus:border-[#e5c77e] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#e5c77e] px-6 py-4 font-bold text-[#151515] hover:bg-[#f3d994] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e5c77e]"
                >
                  Preview form submission
                </button>

                {status && (
                  <p role="status" className="text-sm text-white/80">
                    {status}
                  </p>
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
      <label htmlFor={name} className="block text-sm text-white/80">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        required={required}
        className="mt-2 w-full rounded-lg border border-white/25 bg-white/5 px-4 py-3 text-white focus:border-[#e5c77e] focus:outline-none"
      />
    </div>
  );
}
