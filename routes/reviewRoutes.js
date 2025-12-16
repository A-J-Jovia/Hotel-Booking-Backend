import express from "express";
import { addReview, getHotelReviews } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addReview);
router.get("/:hotelId", getHotelReviews);

export default router;
