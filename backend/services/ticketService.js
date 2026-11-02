import crypto from "node:crypto";
import QRCode from "qrcode";
import nodemailer from "nodemailer";
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
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  });

  return cachedTransporter;
}

export async function sendDigitalTicketEmail(ticket, ticketPayload) {
  const transporter = getTransporter();

  if (!transporter) {
    console.log(`[ticket] Digital ticket ${ticket.ticketNumber} created for ${ticket.contact}. Email skipped (SMTP not configured).`);
    return { sent: false, skipped: true, ticketNumber: ticket.ticketNumber };
  }

  const isInPerson = ticket.deliveryMethod === "in-person";
  const verificationUrl = `https://mopra.org/tickets/verify/${ticket.ticketNumber}`;
  const ticketUrl = `${process.env.APP_URL || "http://localhost:5173"}/tickets`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || "no-reply@mopra.org",
    to: ticket.contact,
    subject: `Your ${ticket.ticketNumber} raffle ticket is confirmed`,
    text: [
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
    ].join("\n"),
    html: `<p>Hi ${ticket.firstName} ${ticket.lastName},</p>
      <p>Your payment was confirmed. Your raffle ticket is ready.</p>
      <p>Ticket number: <strong>${ticket.ticketNumber}</strong></p>
      ${isInPerson
        ? "<p>Please bring this ticket number to the meeting for in-person verification.</p>"
        : "<p>Scan the QR code or show the ticket number at the meeting:</p>"}
      <img src="${ticketPayload.qrDataUrl}" alt="Raffle ticket QR code" width="180" />
      <p><a href="${verificationUrl}">Verify your ticket</a></p>
      <p>Thank you for supporting the Mouvement Patriotique pour la Renaissance de L’Asile.</p>`,
  };

  if (ticketPayload.qrDataUrl) {
    mailOptions.attachments = [
      {
        filename: `${ticket.ticketNumber}.png`,
        content: Buffer.from(ticketPayload.qrDataUrl.split(",")[1], "base64"),
        cid: "ticket-qr",
      },
    ];
  }

  const info = await transporter.sendMail(mailOptions);
  return { sent: true, messageId: info.messageId, ticketNumber: ticket.ticketNumber };
}
