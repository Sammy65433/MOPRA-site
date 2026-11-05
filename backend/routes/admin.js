import { Router } from "express";
import Reservation from "../models/Reservation.js";
import RaffleConfig from "../models/RaffleConfig.js";
import { sendReservationNotificationEmail } from "../services/ticketService.js";

const router = Router();

function checkAdminToken(req, res, next) {
  const token = req.query.token || req.headers["x-admin-token"];
  const expected = process.env.ADMIN_PASSWORD || process.env.ADMIN_TOKEN;
  if (!expected || token !== expected) {
    return res.status(401).json({ error: "Unauthorized. Provide a valid admin password." });
  }
  next();
}

// GET /api/admin/tickets?token=...
router.get("/tickets", checkAdminToken, async (req, res) => {
  try {
    const reservations = await Reservation.find({
      status: { $in: ["paid", "delivered"] },
    }).sort({ paidAt: -1, createdAt: -1 });

    const tickets = reservations.flatMap((r) =>
      (r.ticketNumbers && r.ticketNumbers.length ? r.ticketNumbers : [r.ticketNumber])
        .filter(Boolean)
        .map((number) => ({
          ticketNumber: number,
          reservationId: r._id,
          firstName: r.firstName,
          lastName: r.lastName,
          contact: r.contact,
          quantity: r.quantity,
          status: r.status,
          deliveryMethod: r.deliveryMethod,
          paidAt: r.paidAt,
          deliveredAt: r.deliveredAt,
        }))
    );

    return res.status(200).json({ reservations, tickets });
  } catch (err) {
    console.error("Admin tickets error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /api/admin/tickets — staff create reservation (e.g. phone payments)
// Body: { firstName, lastName, contact, quantity, message, deliveryMethod, paymentMethod }
router.post("/tickets", checkAdminToken, async (req, res) => {
  try {
    const { firstName, lastName, contact, quantity, message, deliveryMethod, paymentMethod } =
      req.body || {};

    if (!firstName || !lastName || !contact) {
      return res.status(400).json({
        error: "First name, last name, and contact (email or phone) are required.",
      });
    }

    const tickets = Math.floor(Number(quantity));
    if (!Number.isFinite(tickets) || tickets < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1 ticket." });
    }
    if (tickets > 5) {
      return res.status(400).json({ error: "You can reserve up to 5 tickets per person." });
    }

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
      return res.status(409).json({
        error: "A reservation already exists for this name or contact.",
      });
    }

    const capacity = Number(process.env.RAFFLE_CAPACITY || 0);
    if (capacity > 0) {
      const activeReservations = await Reservation.find({
        status: { $in: ["pending", "paid"] },
      }).select("quantity");
      const activeTotal = activeReservations.reduce(
        (sum, reservation) => sum + (reservation.quantity || 0),
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
      paymentMethod: paymentMethod || "phone",
      deliveryMethod:
        deliveryMethod && ["digital", "in-person"].includes(deliveryMethod)
          ? deliveryMethod
          : "none",
    });

    let emailNotification = { sent: false, skipped: true };
    try {
      emailNotification = await sendReservationNotificationEmail(reservation);
    } catch (emailErr) {
      console.error("Admin reservation notification email failed:", emailErr);
    }

    return res.status(201).json({
      reservation,
      emailNotification,
      message: "Reservation created by staff. Confirm payment to issue the raffle ticket.",
    });
  } catch (err) {
    console.error("Admin create reservation error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// PATCH /api/admin/tickets/:id/cancel?token=...
router.patch("/tickets/:id/cancel", checkAdminToken, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found." });
    }
    if (reservation.status === "cancelled") {
      return res.status(400).json({ error: "Already cancelled." });
    }
    reservation.status = "cancelled";
    reservation.deliveredAt = reservation.deliveredAt || null;
    await reservation.save();
    return res.status(200).json({ reservation });
  } catch (err) {
    console.error("Cancel error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/admin/tickets/:id?token=...
router.delete("/tickets/:id", checkAdminToken, async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found." });
    }
    return res.status(200).json({ deleted: true, id: req.params.id });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// PATCH /api/admin/winner?token=...  body: { ticketNumber, name }
router.patch("/winner", checkAdminToken, async (req, res) => {
  try {
    const { ticketNumber, name } = req.body || {};
    if (!ticketNumber) {
      return res.status(400).json({ error: "ticketNumber is required." });
    }
    const config = await RaffleConfig.findOneAndUpdate(
      { key: "main" },
      { key: "main", winnerTicketNumber: ticketNumber, winnerName: name || null, drawnAt: new Date() },
      { upsert: true, new: true }
    );
    return res.status(200).json({ config });
  } catch (err) {
    console.error("Set winner error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
