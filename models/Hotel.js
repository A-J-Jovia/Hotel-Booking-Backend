// models/Hotel.js
import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  price: { type: Number, default: 0 },
  description: String,
  image: String,
  amenities: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Hotel", hotelSchema);
