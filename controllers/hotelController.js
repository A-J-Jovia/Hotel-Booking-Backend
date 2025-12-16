import Hotel from "../models/Hotel.js";

export async function getHotels(req, res) {
  const hotels = await Hotel.find().sort({ createdAt: -1 });
  res.json(hotels);
}

export async function getHotel(req, res) {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) return res.status(404).json({ message: "Hotel not found" });
  res.json(hotel);
}

export async function addHotel(req, res) {
  const hotel = await Hotel.create(req.body);
  res.status(201).json(hotel);
}

export async function updateHotel(req, res) {
  const updated = await Hotel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
}

export async function deleteHotel(req, res) {
  await Hotel.findByIdAndDelete(req.params.id);
  res.json({ message: "Hotel removed" });
}
