const express = require("express");
const router = express.Router();

const authenticate = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

router.get("/me", authenticate, (req, res) => {
  res.json({ message: "You are authenticated ✅", user: req.user });
});

router.get("/admin-only", authenticate, authorizeRoles("ADMIN"), (req, res) => {
  res.json({ message: "Welcome Admin ✅", user: req.user });
});

// ✅ New: Admin get all users
router.get("/", authenticate, authorizeRoles("ADMIN"), async (req, res) => {
  try {
    const pool = require("../../config/db");
    const result = await pool.query(
      `SELECT id, full_name, email, phone, user_role, is_active, created_at
       FROM users
       ORDER BY created_at DESC`
    );
    res.json({ users: result.rows });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// ✅ User Dashboard
router.get("/dashboard", authenticate, async (req, res) => {
  try {
    const pool = require("../../config/db");
    const userId = req.user.id;

    const booksReadQuery = pool.query(
      `SELECT COUNT(*) AS books_read FROM rentals WHERE user_id = $1`,
      [userId]
    );

    const activeRentalsQuery = pool.query(
      `SELECT r.id, r.status, r.due_date, b.title
       FROM rentals r
       JOIN books b ON r.book_id = b.id
       WHERE r.user_id = $1 AND r.status IN ('REQUESTED','DISPATCHED','RETURN_INITIATED')
       ORDER BY r.created_at DESC`,
      [userId]
    );

    const rentalHistoryQuery = pool.query(
      `SELECT r.id, r.status, r.due_date, r.returned_at, b.title
       FROM rentals r
       JOIN books b ON r.book_id = b.id
       WHERE r.user_id = $1 AND r.status = 'COMPLETED'
       ORDER BY r.returned_at DESC`,
      [userId]
    );

    const wishlistQuery = pool.query(
      `SELECT b.id, b.title, b.genre, b.avg_rating
       FROM wishlists w
       JOIN books b ON w.book_id = b.id
       WHERE w.user_id = $1`,
      [userId]
    );

    const reviewsQuery = pool.query(
      `SELECT r.id, r.rating, r.review_text, b.title
       FROM reviews r
       JOIN books b ON r.book_id = b.id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC`,
      [userId]
    );

    const [booksRead, activeRentals, rentalHistory, wishlist, reviews] =
      await Promise.all([
        booksReadQuery,
        activeRentalsQuery,
        rentalHistoryQuery,
        wishlistQuery,
        reviewsQuery,
      ]);

    res.json({
      books_read: Number(booksRead.rows[0].books_read),
      active_rentals: activeRentals.rows,
      rental_history: rentalHistory.rows,
      wishlist: wishlist.rows,
      reviews: reviews.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch dashboard" });
  }
});
module.exports = router;