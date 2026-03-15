const pool = require("../../config/db");

const addReview = async (userId, bookId, rating, reviewText) => {
  // ✅ Check if user already reviewed this book
  const existing = await pool.query(
    `SELECT * FROM reviews WHERE user_id = $1 AND book_id = $2`,
    [userId, bookId]
  );

  if (existing.rows.length > 0) {
    throw new Error("You have already reviewed this book");
  }

  // ✅ Insert review
  const result = await pool.query(
    `INSERT INTO reviews (user_id, book_id, rating, review_text)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, bookId, rating, reviewText]
  );

  // ✅ Update avg_rating and review_count in books table
  await pool.query(
    `UPDATE books
     SET avg_rating = (
       SELECT ROUND(AVG(rating)::numeric, 2)
       FROM reviews
       WHERE book_id = $1
     ),
     review_count = (
       SELECT COUNT(*)
       FROM reviews
       WHERE book_id = $1
     ),
     updated_at = NOW()
     WHERE id = $1`,
    [bookId]
  );

  return result.rows[0];
};

const getReviewsByBook = async (bookId) => {
  const result = await pool.query(
    `SELECT r.*, u.full_name
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.book_id = $1
     ORDER BY r.created_at DESC`,
    [bookId]
  );

  return result.rows;
};

const deleteReview = async (reviewId) => {
  // ✅ Get review before deleting to update book rating after
  const reviewResult = await pool.query(
    `SELECT * FROM reviews WHERE id = $1`,
    [reviewId]
  );

  if (reviewResult.rows.length === 0) {
    throw new Error("Review not found");
  }

  const review = reviewResult.rows[0];

  // ✅ Delete review
  await pool.query(
    `DELETE FROM reviews WHERE id = $1`,
    [reviewId]
  );

  // ✅ Update avg_rating and review_count after deletion
  await pool.query(
    `UPDATE books
     SET avg_rating = COALESCE((
       SELECT ROUND(AVG(rating)::numeric, 2)
       FROM reviews
       WHERE book_id = $1
     ), 0),
     review_count = (
       SELECT COUNT(*)
       FROM reviews
       WHERE book_id = $1
     ),
     updated_at = NOW()
     WHERE id = $1`,
    [review.book_id]
  );

  return reviewResult.rows[0];
};

module.exports = { addReview, getReviewsByBook, deleteReview };