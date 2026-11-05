import crypto from "node:crypto";
import QRCode from "qrcode";
import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";
import Reservation from "../models/Reservation.js";

const TICKET_PREFIX = "MOPRA-";
const TICKET_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateTicketNumber() {
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `${TICKET_PREFIX}${random}`;
}

export async function buildTicketPayload(ticket) {
  const ticketNumber = ticket.ticketNumber || generateTicketNumber();
  const verificationUrl = `https://mopra.org/tickets/verify/${ticketNumber}`;

  const qrDataUrl = await QRCode.toDataURL(verificationUrl);

  return {
    ticketNumber,
    ticketNumbers: ticket.ticketNumbers || [],
    verificationCode: ticketNumber,
    recipient: {
      firstName: ticket.firstName,
      lastName: ticket.lastName,
      email: ticket.contact,
    },
    quantity: ticket.quantity,
    deliveryMethod: ticket.deliveryMethod,
    status: ticket.status,
    price: Number(process.env.TICKET_PRICE_USD || 100),
    paymentMethod: ticket.paymentMethod,
    paymentReference: ticket.paymentReference,
    qrDataUrl,
    issuedAt: ticket.paidAt || ticket.createdAt,
    paidAt: ticket.paidAt,
    deliveredAt: ticket.deliveredAt,
  };
}

// ---------------------------------------------------------------------------
// Unified email sender.
// Render (and many hosts) block outbound SMTP ports, so in production we prefer
// the SendGrid HTTP API. SMTP (nodemailer) is kept as a fallback for local dev.
// ---------------------------------------------------------------------------
let cachedTransporter = null;

function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  if (!process.env.SMTP_HOST) {
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  });

  return cachedTransporter;
}

// Configure SendGrid once if an API key is present.
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

function hasSendGrid() {
  return Boolean(process.env.SENDGRID_API_KEY);
}

function hasSmtp() {
  return Boolean(process.env.SMTP_HOST);
}

// Send an email using whichever provider is configured.
// Returns { sent, messageId?, skipped?, error? }.
async function sendEmail({ to, from, subject, text, html, attachments = [] }) {
  const sender = from || process.env.EMAIL_FROM || "no-reply@mopra.org";

  // Prefer SendGrid HTTP API (works on Render where SMTP ports are blocked).
  if (hasSendGrid()) {
    try {
      const sgAttachments = attachments
        .filter((a) => a && a.content)
        .map((a) => ({
          content: String(a.content).includes(",")
            ? String(a.content).split(",").pop()
            : String(a.content),
          filename: a.filename || "attachment",
          type: a.type || "application/octet-stream",
          disposition: a.disposition || "attachment",
        }));

      const [response] = await sgMail.send({
        to,
        from: sender,
        subject,
        text,
        html,
        attachments: sgAttachments.length ? sgAttachments : undefined,
      });

      return {
        sent: true,
        messageId: response?.headers?.["x-message-id"] || null,
        provider: "sendgrid",
      };
    } catch (err) {
      const message =
        err?.response?.body?.errors?.[0]?.message ||
        err?.message ||
        String(err);
      console.error("[email] SendGrid send failed:", message);
      return { sent: false, error: "email_failed", message, provider: "sendgrid" };
    }
  }

  // Fallback: SMTP via nodemailer (local dev).
  const transporter = getTransporter();
  if (!transporter) {
    console.log(`[email] No email provider configured. Skipping send to ${to}.`);
    return { sent: false, skipped: true };
  }

  try {
    const info = await transporter.sendMail({
      from: sender,
      to,
      subject,
      text,
      html,
      attachments,
    });
    return { sent: true, messageId: info.messageId, provider: "smtp" };
  } catch (err) {
    console.error("[email] SMTP send failed:", err?.message || err);
    return { sent: false, error: "email_failed", message: err?.message || String(err), provider: "smtp" };
  }
}

export async function sendDigitalTicketEmail(ticket, ticketPayload) {
  const isInPerson = ticket.deliveryMethod === "in-person";
  const verificationUrl = `https://mopra.org/tickets/verify/${ticket.ticketNumber}`;

  const text = [
    `Hi ${ticket.firstName} ${ticket.lastName},`,
    "",
    "Your payment was confirmed. Your raffle ticket is ready.",
    `Ticket number: ${ticket.ticketNumber}`,
    isInPerson
      ? "Please bring this ticket number to the meeting for in-person verification."
      : "Scan the QR code or show the ticket number at the meeting.",
    "",
    verificationUrl,
    "",
    "Thank you for supporting the Mouvement Patriotique pour la Renaissance de L’Asile.",
  ].join("\n");

  const html = `<p>Hi ${ticket.firstName} ${ticket.lastName},</p>
    <p>Your payment was confirmed. Your raffle ticket is ready.</p>
    <p>Ticket number: <strong>${ticket.ticketNumber}</strong></p>
    ${isInPerson
      ? "<p>Please bring this ticket number to the meeting for in-person verification.</p>"
      : "<p>Scan the QR code or show the ticket number at the meeting:</p>"}
    <img src="${ticketPayload.qrDataUrl}" alt="Raffle ticket QR code" width="180" />
    <p><a href="${verificationUrl}">Verify your ticket</a></p>
    <p>Thank you for supporting the Mouvement Patriotique pour la Renaissance de L’Asile.</p>`;

  const attachments = ticketPayload.qrDataUrl
    ? [
        {
          content: ticketPayload.qrDataUrl,
          filename: `${ticket.ticketNumber}.png`,
          type: "image/png",
          disposition: "attachment",
        },
      ]
    : [];

  return sendEmail({
    to: ticket.contact,
    subject: `Your ${ticket.ticketNumber} raffle ticket is confirmed`,
    text,
    html,
    attachments,
  });
}

export async function sendReservationNotificationEmail(reservation) {
  const organizerEmail = process.env.ORGANIZER_EMAIL || "info@gomopra.org, Cahctca@gmail.com";
  const organizerList = organizerEmail
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  const primaryOrganizer = organizerList[0] || "info@gomopra.org";
  const unitPrice = Number(process.env.TICKET_PRICE_USD || 100);
  const totalAmount = (reservation.quantity * unitPrice).toFixed(2);
  const paymentUrl = "https://link.clover.com/urlshortener/CVF3dD";

  if (!hasSendGrid() && !hasSmtp()) {
    console.log(
      `[reservation] New reservation from ${reservation.firstName} ${reservation.lastName} (${reservation.contact}) for ${reservation.quantity} ticket(s) ($${totalAmount}). Email skipped (no provider configured).`
    );
    return { sent: false, skipped: true };
  }

  const organizerResult = await sendEmail({
    to: organizerList.join(", "),
    subject: `New MOPRA Raffle Reservation: ${reservation.firstName} ${reservation.lastName} (${reservation.quantity} ticket${reservation.quantity > 1 ? "s" : ""})`,
    text: [
      "New MOPRA Grand Raffle ticket reservation received:",
      "",
      `Name: ${reservation.firstName} ${reservation.lastName}`,
      `Contact: ${reservation.contact}`,
      `Tickets: ${reservation.quantity}`,
      `Total ($${unitPrice.toFixed(2)} each): $${totalAmount} USD`,
      `Message: ${reservation.message || "None"}`,
      `Reservation ID: ${reservation._id}`,
      "",
      `Once payment is verified in Clover (${paymentUrl}), confirm the ticket in the MOPRA backend.`,
    ].join("\n"),
  });

  let customerResult = { sent: false, skipped: true };
  if (String(reservation.contact).includes("@")) {
    customerResult = await sendEmail({
      to: reservation.contact,
      replyTo: primaryOrganizer,
      subject: "MOPRA Grand Raffle — Reservation Received ($100/ticket)",
      text: [
        `Hi ${reservation.firstName} ${reservation.lastName},`,
        "",
        `We received your reservation for ${reservation.quantity} raffle ticket(s) ($${totalAmount} USD total).`,
        "",
        "To complete your entry, please submit your payment using the official MOPRA QR code on our website or via our secure Clover checkout link:",
        paymentUrl,
        "",
        `Once our team confirms your payment, your official raffle ticket number will be issued. Questions? Reply to ${primaryOrganizer}.`,
      ].join("\n"),
    });
  }

  const allSent = organizerResult.sent && (customerResult.sent || customerResult.skipped);
  return { sent: allSent, organizer: organizerResult, customer: customerResult };
}
