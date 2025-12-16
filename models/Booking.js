// models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    hotelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true
    },
    // 🔥 CHANGE: Use Date type for proper date calculation/comparison
    checkin: { type: Date, required: true },
    checkout: { type: Date, required: true },
    guests: { type: Number, required: true },
    totalPrice: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Booking", bookingSchema);