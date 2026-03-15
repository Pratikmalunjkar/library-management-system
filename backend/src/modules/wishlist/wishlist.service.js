const pool = require("../../config/db");

const addToWishlist = async (userId, bookId) => {
  const result = await pool.query(
    `INSERT INTO wishlists (user_id, book_id)
     VALUES ($1, $2)
     RETURNING *`,
    [userId, bookId]
  );

  // ✅ Update wishlist_count in books
  await pool.query(
    `UPDATE books
     SET wishlist_count = wishlist_count + 1,
         updated_at = NOW()
     WHERE id = $1`,
    [bookId]
  );

  return result.rows[0];
};

const getUserWishlist = async (userId) => {
  const result = await pool.query(
    `SELECT b.*
     FROM wishlists w
     JOIN books b ON w.book_id = b.id
     WHERE w.user_id = $1`,
    [userId]
  );

  return result.rows;
};

const removeFromWishlist = async (userId, bookId) => {
  const result = await pool.query(
    `DELETE FROM wishlists
     WHERE user_id = $1 AND book_id = $2
     RETURNING *`,
    [userId, bookId]
  );

  if (result.rows.length === 0) {
    throw new Error("Wishlist item not found");
  }

  // ✅ Update wishlist_count in books
  await pool.query(
    `UPDATE books
     SET wishlist_count = GREATEST(wishlist_count - 1, 0),
         updated_at = NOW()
     WHERE id = $1`,
    [bookId]
  );

  return result.rows[0];
};

module.exports = { addToWishlist, getUserWishlist, removeFromWishlist };