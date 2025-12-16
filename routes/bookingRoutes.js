import express from "express";
import { addBooking, getUserBookings, cancelBooking } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addBooking);
router.get("/", protect, getUserBookings);
router.delete("/:id", protect, cancelBooking);

export default router;
