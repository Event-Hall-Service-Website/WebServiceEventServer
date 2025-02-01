import mongoose from "mongoose";
import validator from "email-validator";
const BookingSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    clientEmail: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => validator.validate(email),
        message: "Invalid email format",
      },
    },
    clientPhone: { type: String, required: true },
    eventDate: { type: Date, required: true },
    startTime: { type: String, required: true }, // "14:00"
    endTime: { type: String, required: true }, // "18:00"
    eventType: {
      type: String,
      required: true,
      enum: ["wedding", "conference", "party", "seminar", "other"],
    },
    numberOfGuests: { type: Number, required: true },
    specialRequests: { type: String },
    hallId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hall",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", BookingSchema);
