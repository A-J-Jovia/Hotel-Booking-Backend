import express from "express";
import {
  getHotels,
  getHotel,
  addHotel,
  updateHotel,
  deleteHotel
} from "../controllers/hotelController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getHotels);
router.get("/:id", getHotel);

// 🔒 ADMIN ONLY
router.post("/", protect, adminOnly, addHotel);
router.put("/:id", protect, adminOnly, updateHotel);
router.delete("/:id", protect, adminOnly, deleteHotel);

export default router;
