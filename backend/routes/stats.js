import { Router } from "express";
import Reservation from "../models/Reservation.js";
import RaffleConfig from "../models/RaffleConfig.js";

const router = Router();

// GET /api/stats  (public) — participation counts + winner (if drawn)
router.get("/stats", async (req, res) => {
  try {
    const confirmed = await Reservation.find({
      status: { $in: ["paid", "delivered"] },
    }).select("quantity ticketNumbers ticketNumber");

    const participants = confirmed.length;
    const ticketsSold = confirmed.reduce((sum, r) => sum + (r.quantity || 0), 0);

    const config = await RaffleConfig.findOne({ key: "main" });

    const winner =
      config && config.winnerTicketNumber
        ? { ticketNumber: config.winnerTicketNumber, name: config.winnerName, drawnAt: config.drawnAt }
        : null;

    return res.status(200).json({ participants, ticketsSold, winner });
  } catch (err) {
    console.error("Stats error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
