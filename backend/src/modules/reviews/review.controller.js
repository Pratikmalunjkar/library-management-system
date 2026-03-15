const reviewService = require("./review.service");

const addReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { book_id, rating, comment } = req.body;

    if (!book_id || !rating) {
      return res.status(400).json({ message: "book_id and rating are required" });
    }

    const review = await reviewService.addReview(userId, book_id, rating, comment);

    res.status(201).json({
      message: "Review added successfully",
      review
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getReviewsByBook = async (req, res) => {
  try {
    const bookId = req.params.bookId;

    const reviews = await reviewService.getReviewsByBook(bookId);

    res.status(200).json({ reviews });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const deletedReview = await reviewService.deleteReview(req.params.id);

    res.status(200).json({
      message: "Review deleted successfully",
      review: deletedReview
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  addReview,
  getReviewsByBook,
  deleteReview
};