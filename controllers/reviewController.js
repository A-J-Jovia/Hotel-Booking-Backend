import Review from "../models/Review.js";
import Hotel from "../models/Hotel.js";

// ---------------- ADD REVIEW ----------------
export const addReview = async (req, res) => {
  try {
    const { hotelId, rating, comment } = req.body;

    if (!hotelId || !rating) {
      return res.status(400).json({
        ok: false,
        message: "Hotel and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        ok: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const review = await Review.create({
      userId: req.user.id,
      hotelId,
      rating,
      comment,
    });

    // Optional: update average rating later
    res.status(201).json({
      ok: true,
      review,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        ok: false,
        message: "You have already reviewed this hotel",
      });
    }

    res.status(500).json({
      ok: false,
      message: err.message,
    });
  }
};

// ---------------- GET HOTEL REVIEWS ----------------
export const getHotelReviews = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const reviews = await Review.find({ hotelId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) /
      (reviews.length || 1);

    res.json({
      ok: true,
      reviews,
      avgRating: Number(avgRating.toFixed(1)),
      count: reviews.length,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: err.message,
    });
  }
};
