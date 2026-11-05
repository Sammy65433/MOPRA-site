import { Router } from "express";
import Reservation from "../models/Reservation.js";

const router = Router();

function checkAdminToken(req, res, next) {
  const token = req.query.token || req.headers["x-admin-token"];
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized. Provide a valid admin token." });
  }
  next();
}

// GET /api/admin/tickets?token=...
// Returns only confirmed (paid/delivered) reservations with their issued ticket numbers.
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

export default router;
