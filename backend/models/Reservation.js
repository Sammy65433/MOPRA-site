import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    contact: {
      type: String,
      required: true,
      trim: true,
      maxlength: 254,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "paid", "delivered", "cancelled", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["clover", "qr", "card", "zelle", "cashapp", "bank", "stripe", null],
      default: null,
    },
    paymentReference: {
      type: String,
      trim: true,
      default: null,
    },
    ticketNumber: {
      type: String,
      default: null,
    },
    ticketNumbers: {
      type: [String],
      default: [],
    },
    deliveryMethod: {
      type: String,
      enum: ["digital", "in-person", "none"],
      default: "none",
    },
    paidAt: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Reservation || mongoose.model("Reservation", reservationSchema);
