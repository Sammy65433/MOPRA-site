import { Router } from "express";
import Reservation from "../models/Reservation.js";
import {
  generateTicketNumber,
  buildTicketPayload,
  sendDigitalTicketEmail,
  sendReservationNotificationEmail,
} from "../services/ticketService.js";

const router = Router();

const ACTIVE_STATUSES = ["pending", "paid"];

// POST /api/tickets/reserve
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

    // Prevent duplicate reservations by name or contact (email/phone).
    const escapeRegex = (value) =>
      String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const duplicate = await Reservation.findOne({
      status: { $in: ["pending", "paid", "delivered"] },
      $or: [
        { contact: { $regex: `^${escapeRegex(contact)}$`, $options: "i" } },
        {
          $and: [
            { firstName: { $regex: `^${escapeRegex(firstName)}$`, $options: "i" } },
            { lastName: { $regex: `^${escapeRegex(lastName)}$`, $options: "i" } },
          ],
        },
      ],
    });

    if (duplicate) {
      const sameContact =
        String(duplicate.contact).toLowerCase() === String(contact).toLowerCase();
      const sameName =
        String(duplicate.firstName).toLowerCase() === String(firstName).toLowerCase() &&
        String(duplicate.lastName).toLowerCase() === String(lastName).toLowerCase();

      let reason = "a reservation with these details";
      if (sameContact && sameName) reason = "this name and contact";
      else if (sameContact) reason = "this email or phone number";
      else if (sameName) reason = "this name";

      return res.status(409).json({
        error: `A reservation already exists for ${reason}. Each person may only reserve once.`,
      });
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
      paymentMethod: paymentMethod || "clover",
      deliveryMethod: "none",
    });

    let emailNotification = { sent: false, skipped: true };
    try {
      emailNotification = await sendReservationNotificationEmail(reservation);
    } catch (emailErr) {
      console.error("Reservation notification email failed:", emailErr);
    }

    return res.status(201).json({
      reservation,
      emailNotification,
      message: "Reservation received. Complete your payment to issue your raffle ticket.",
    });
  } catch (err) {
    console.error("Reserve error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /api/tickets
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
        emailResult = { sent: false, error: "email_failed", message: emailError?.message || String(emailError) };
      }

      return res.status(200).json({ reservation, ticket, email: emailResult });
    }

    return res.status(200).json({ reservation, ticket, delivery: "in-person" });
  } catch (err) {
    console.error("Delivery error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /api/tickets/:id/resend
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

    let emailResult = { sent: false, skipped: true, ticketNumber: reservation.ticketNumber };
    try {
      emailResult = await sendDigitalTicketEmail(reservation, ticket);
    } catch (emailError) {
      console.error("Digital ticket email resend failed:", emailError);
      emailResult = { sent: false, error: "email_failed" };
    }

    return res.status(200).json({ reservation, ticket, email: emailResult });
  } catch (err) {
    console.error("Resend error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
