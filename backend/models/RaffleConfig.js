import mongoose from "mongoose";

const raffleConfigSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },
    winnerTicketNumber: { type: String, default: null },
    winnerName: { type: String, default: null },
    drawnAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.RaffleConfig ||
  mongoose.model("RaffleConfig", raffleConfigSchema);
