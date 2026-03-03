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
  "http://joviabucket123.s3-website-ap-southeast-2.amazonaws.com",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://hotel-booking-nine-tawny.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-to-server requests (Postman, curl)
      if (!origin) return callback(null, true);

      // Allow all Vercel preview & production deployments
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      // Allow specific origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("❌ CORS not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Allow preflight requests
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
  res.send("✅ Hotel Booking API Running on Render");
});

// ================== START SERVER ==================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});