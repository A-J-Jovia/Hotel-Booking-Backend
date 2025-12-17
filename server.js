import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ================== CORS CONFIG ==================
const allowedOrigins = [
  "http://localhost:5173",
  "https://hotel-booking-nine-tawny.vercel.app",
];

app.use(
  cors({
    origin: [
      "http://joviabucket123.s3-website-ap-southeast-2.amazonaws.com",
      "https://joviabucket123.s3-website-ap-southeast-2.amazonaws.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

app.options("*", cors());

// ================== MIDDLEWARE ==================
app.use(express.json());

// ================== ROUTES ==================
app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);

// ================== HEALTH CHECK ==================
app.get("/", (req, res) => {
  res.send("Hotel Booking API Running");
});

// ================== START SERVER ==================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
