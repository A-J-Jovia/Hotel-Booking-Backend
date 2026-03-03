// controllers/bookingController.js
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);


// Helper function to check if a booking date range overlaps with an existing booking
const checkDateOverlap = (existing, newCheckIn, newCheckOut) => {
    // Convert dates to dayjs objects
    const existingCheckIn = dayjs(existing.checkin);
    const existingCheckOut = dayjs(existing.checkout);
    
    // Convert new dates, excluding the checkout date from the range check for new booking
    const newCI = dayjs(newCheckIn);
    const newCO = dayjs(newCheckOut);

    // Check for overlap:
    // 1. New Check-in falls within existing booking period
    const overlap1 = newCI.isBetween(existingCheckIn, existingCheckOut, 'day', '[)'); 
    // 2. New Check-out falls within existing booking period
    const overlap2 = newCO.isBetween(existingCheckIn, existingCheckOut, 'day', '(]');
    // 3. Existing booking period falls within the new requested period (full containment)
    const overlap3 = existingCheckIn.isSameOrAfter(newCI) && existingCheckOut.isSameOrBefore(newCO);


    return overlap1 || overlap2 || overlap3;
};

export const addBooking = async (req, res) => {
    try {
        const { hotelId, checkin, checkout, guests } = req.body;

        if (!hotelId || !checkin || !checkout || !guests || guests < 1) {
            return res.status(400).json({
                message: "Invalid booking details. Guests must be at least 1."
            });
        }


        const checkInDate = dayjs(checkin);
        const checkOutDate = dayjs(checkout);

        // 1. Date Validation
        if (!checkInDate.isValid() || !checkOutDate.isValid() || checkOutDate.isSameOrBefore(checkInDate)) {
            return res.status(400).json({ message: "Invalid dates: Check-out must be after check-in." });
        }
        
        // Calculate number of nights
        const nights = checkOutDate.diff(checkInDate, 'day');

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        
        // 2. Availability Check 
        const existingBookings = await Booking.find({ hotelId });
        
        const hasOverlap = existingBookings.some(existing => 
            checkDateOverlap(existing, checkin, checkout)
        );

        if (hasOverlap) {
             return res.status(409).json({ message: "This hotel is already booked for the selected dates." });
        }

        // 3. Price Calculation (Price * Nights * Guests)
        const totalPrice = hotel.price * nights * guests;
        
        const booking = await Booking.create({
            userId: req.user.id,
            hotelId,
            checkin,
            checkout,
            guests,
            totalPrice, 
        });

        res.status(201).json({
            ok: true,
            message: "Booking successful",
            booking,
        });
    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({ message: error.message || "Internal server error during booking." });
    }
};

export const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id })
            .populate("hotelId")
            .sort({ checkin: -1 });

        const formatted = bookings.map((b) => ({
            _id: b._id,
            checkin: dayjs(b.checkin).format("YYYY-MM-DD"),
            checkout: dayjs(b.checkout).format("YYYY-MM-DD"),
            guests: b.guests,
            totalPrice: b.totalPrice,
            createdAt: b.createdAt,
            hotel: b.hotelId,
            nights: dayjs(b.checkout).diff(dayjs(b.checkin), "day"),
        }));

        // ✅ RETURN ARRAY DIRECTLY
        res.status(200).json(formatted);

    } catch (error) {
        console.error("Fetch bookings error:", error);
        res.status(500).json({ message: error.message });
    }
};


export const cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                ok: false,
                message: "Booking not found",
            });
        }

        // 🔒 Only owner can cancel
        if (booking.userId.toString() !== req.user.id) {
            return res.status(403).json({
                ok: false,
                message: "You are not allowed to cancel this booking",
            });
        }

        // ❌ Prevent cancelling past bookings
        const today = dayjs().startOf("day");
        const checkInDate = dayjs(booking.checkin);

        if (checkInDate.isSameOrBefore(today)) {
            return res.status(400).json({
                ok: false,
                message: "You cannot cancel a booking that has already started",
            });
        }

        await booking.deleteOne();

        res.status(200).json({
            ok: true,
            message: "Booking cancelled successfully",
        });

    } catch (error) {
        console.error("Cancel booking error:", error);
        res.status(500).json({
            ok: false,
            message: "Failed to cancel booking",
        });
    }
};
