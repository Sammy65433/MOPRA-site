import { Router } from "express";
import Reservation from "../models/Reservation.js";
import { generateTicketNumber, buildTicketPayload, sendDigitalTicketEmail } from "../services/ticketService.js";

const router = Router();

const ACTIVE_STATUSES = ["pending", "paid"];

// POST /api/tickets/reserve
// Create a "reserve your spot" reservation in MongoDB.
// Once payment is received, staff confirm it via PATCH /api/tickets/:id/payment
// which issues the raffle ticket and moves the reservation to "paid".
router.post("/reserve", async (req, res) => {
  try {
    const { firstName, lastName, contact, quantity, message, paymentMethod } = req.body || {};

    if (!firstName || !lastName || !contact) {
      return res.status(400).json({
        error: "First name, last name, and contact (email or phone) are required.",
      });
    }

    const tickets = Math.floor(Number(quantity));
    if (!Number.isFinite(tickets) || tickets < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1 ticket." });
    }

    const capacity = Number(process.env.RAFFLE_CAPACITY || 0);
    if (capacity > 0) {
      const activeReservations = await Reservation.find({
        status: { $in: ACTIVE_STATUSES },
      }).select("quantity");
      const activeTotal = activeReservations.reduce(
        (sum, reservation) => sum + reservation.quantity,
        0
      );

      if (activeTotal + tickets > capacity) {
        return res.status(409).json({
          error: "Sorry, the raffle is fully booked. Please check back later.",
        });
      }
    }

    const reservation = await Reservation.create({
      firstName,
      lastName,
      contact,
      quantity: tickets,
      message: message || "",
      status: "pending",
      paymentMethod: paymentMethod || null,
      deliveryMethod: "none",
    });

    return res.status(201).json({
      reservation,
      message: "Reservation received. Complete your payment to issue your raffle ticket.",
    });
  } catch (err) {
    console.error("Reserve error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /api/tickets
// List reservations. Optional ?status=pending filter.
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const reservations = await Reservation.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({ reservations });
  } catch (err) {
    console.error("Get tickets error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /api/tickets/:id
router.get("/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found." });
    }

    return res.status(200).json({ reservation });
  } catch (err) {
    console.error("Get ticket error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// PATCH /api/tickets/:id/payment
// Staff confirms payment (Zelle / Cash App / bank transfer / card).
// On success the reservation becomes "paid" and a raffle ticket number is issued.
router.patch("/:id/payment", async (req, res) => {
  try {
    const { paymentMethod, paymentReference } = req.body || {};

    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found." });
    }

    if (reservation.status !== "pending") {
      return res.status(400).json({
        error: `Reservation cannot be paid. Current status: ${reservation.status}.`,
      });
    }

    const ticketNumbers = [];
    for (let i = 0; i < reservation.quantity; i += 1) {
      ticketNumbers.push(generateTicketNumber());
    }

    reservation.status = "paid";
    reservation.paymentMethod = paymentMethod || reservation.paymentMethod;
    reservation.paymentReference = paymentReference || reservation.paymentReference;
    reservation.ticketNumbers = ticketNumbers;
    reservation.ticketNumber = ticketNumbers[0];
    reservation.paidAt = new Date();
    await reservation.save();

    const ticket = await buildTicketPayload(reservation);

    return res.status(200).json({ reservation, ticket });
  } catch (err) {
    console.error("Payment error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// PATCH /api/tickets/:id/delivery
// Mark how the ticket was delivered after payment:
// - digital:   send the digital ticket (QR + ticket number) by email.
// - in-person: staff marks the ticket for in-person pickup/handoff.
router.patch("/:id/delivery", async (req, res) => {
  try {
    const { deliveryMethod } = req.body || {};

    if (!["digital", "in-person"].includes(deliveryMethod)) {
      return res.status(400).json({
        error: "deliveryMethod must be either 'digital' or 'in-person'.",
      });
    }

    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found." });
    }

    if (reservation.status !== "paid") {
      return res.status(400).json({
        error: `Ticket cannot be delivered. Payment status: ${reservation.status}.`,
      });
    }

    reservation.deliveryMethod = deliveryMethod;
    reservation.status = "delivered";
    reservation.deliveredAt = new Date();
    await reservation.save();

    const ticket = await buildTicketPayload(reservation);

    if (deliveryMethod === "digital") {
      let emailResult = { sent: false, skipped: true, ticketNumber: reservation.ticketNumber };

      try {
        emailResult = await sendDigitalTicketEmail(reservation, ticket);
      } catch (emailError) {
        console.error("Digital ticket email failed:", emailError);
        emailResult = { sent: false, error: "email_failed" };
      }

      return res.status(200).json({ reservation, ticket, email: emailResult });
    }

    // In-person delivery: staff keeps the ticket number for handoff.
    return res.status(200).json({ reservation, ticket, delivery: "in-person" });
  } catch (err) {
    console.error("Delivery error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /api/tickets/:id/resend
// Resend the digital ticket email for a delivered digital ticket.
router.post("/:id/resend", async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found." });
    }

    if (reservation.status !== "delivered" || reservation.deliveryMethod !== "digital") {
      return res.status(400).json({
        error: "Only delivered digital tickets can be resent.",
      });
    }

    const ticket = await buildTicketPayload(reservation);
    const emailResult = await sendDigitalTicketEmail(reservation, ticket);

    return res.status(200).json({ reservation, ticket, email: emailResult });
  } catch (err) {
    console.error("Resend error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
