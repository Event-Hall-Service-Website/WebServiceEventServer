import { Booking } from "../models/BookingSchema.js";
import { generateToken } from "../utils/generateToken.js";
import Validator from "email-validator";
import mongoose from "mongoose";

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

    // Validate email format
    if (!Validator.validate(clientEmail)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    // Validate if hallId is a valid ObjectId (if it's a reference to a Hall collection)
    if (!mongoose.isValidObjectId(hallId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid hallId format" });
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

    // Ensure start time is before end time
    if (startTime >= endTime) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Start time must be before end time",
        });
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
      hallId,
      status,
    });

    // Save to database
    await newBooking.save();

    // Generate token (if necessary for your system)
    generateToken(res, newBooking._id);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      bookingDetails: newBooking,
    });
  } catch (error) {
    console.error("Error booking event:", error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This email is already associated with a booking.",
      });
    }

    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
