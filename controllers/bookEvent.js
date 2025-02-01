import { Booking } from "../models/BookingSchema.js";
import mongoose from "mongoose";
import { generateToken } from "../utils/generateToken.js";
import Validator from "email-validator";
export const BookForAnEvent = async (req, res) => {
  const {
    clientName,
    clientEmail,
    clientPhone,
    eventDate,
    startTime,
    endTime,
    eventType,
    numberOfGuests,
    specialRequests,
    hallId,
    status,
  } = req.body;

  try {
    // Validate required fields (specialRequests can be optional)
    if (
      !clientEmail ||
      !clientName ||
      !clientPhone ||
      !eventDate ||
      !startTime ||
      !endTime ||
      !eventType ||
      !numberOfGuests ||
      !hallId ||
      !status
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    // Validate email
    if (!Validator.validate(clientEmail)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    // Check if the user already has a booking for the same date and hall
    const existingBooking = await Booking.findOne({
      clientEmail,
      eventDate,
      hallId,
    });
    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "Booking already exists for this date and hall",
      });
    }

    // Validate hallId before converting
    if (!mongoose.isValidObjectId(hallId)) {
      return res.status(400).json({ error: "Invalid hallId format" });
    }

    // Create new booking instance
    const newBooking = new Booking({
      clientName,
      clientEmail,
      clientPhone,
      eventDate,
      startTime,
      endTime,
      eventType,
      numberOfGuests,
      specialRequests,
      hallId: new mongoose.Types.ObjectId(hallId), // Convert hallId to ObjectId
      status,
    });

    // Save to database
    await newBooking.save();
    generateToken(res, newBooking._id);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      bookingDetails: newBooking,
    });
  } catch (error) {
    console.error("Error booking event:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
