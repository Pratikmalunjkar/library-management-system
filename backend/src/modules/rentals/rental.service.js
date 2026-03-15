const pool = require("../../config/db");

// User requests a rental
const requestRental = async (userId, bookId) => {
  const result = await pool.query(
    `INSERT INTO rentals (user_id, book_id, rental_date, due_date, status)
     VALUES ($1, $2, NOW(), NOW() + INTERVAL '14 days', 'REQUESTED')
     RETURNING *`,
    [userId, bookId]
  );
  return result.rows[0];
};

// Admin dispatches rental
const dispatchRental = async (rentalId) => {
  // Get rental
  const rentalResult = await pool.query(
    `SELECT * FROM rentals WHERE id = $1`,
    [rentalId]
  );
  if (rentalResult.rows.length === 0) {
    throw new Error("Rental not found");
  }
  const rental = rentalResult.rows[0];

  // Ensure rental is in REQUESTED state
  if (rental.status !== "REQUESTED") {
    throw new Error("Rental cannot be dispatched from current status");
  }

  // Reduce available copies and increment rental count
  const bookResult = await pool.query(
    `UPDATE books
     SET available_copies = available_copies - 1,
         rental_count = rental_count + 1,
         updated_at = NOW()
     WHERE id = $1 AND available_copies > 0
     RETURNING *`,
    [rental.book_id]
  );
  if (bookResult.rows.length === 0) {
    throw new Error("Book is not available for dispatch");
  }

  // Update rental status
  const result = await pool.query(
    `UPDATE rentals
     SET status = 'DISPATCHED',
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [rentalId]
  );
  return result.rows[0];
};

// User initiates return
const initiateReturn = async (rentalId) => {
  const result = await pool.query(
    `UPDATE rentals
     SET status = 'RETURN_INITIATED',
         updated_at = NOW()
     WHERE id = $1 AND status = 'DISPATCHED'
     RETURNING *`,
    [rentalId]
  );
  if (result.rows.length === 0) {
    throw new Error("Rental not found or not eligible for return");
  }
  return result.rows[0];
};

// Admin completes rental
const completeRental = async (rentalId) => {
  // Get rental
  const rentalResult = await pool.query(
    `SELECT * FROM rentals WHERE id = $1`,
    [rentalId]
  );
  if (rentalResult.rows.length === 0) {
    throw new Error("Rental not found");
  }
  const rental = rentalResult.rows[0];

  // Ensure rental is in RETURN_INITIATED state
  if (rental.status !== "RETURN_INITIATED") {
    throw new Error("Rental cannot be completed from current status");
  }

  // Increase available copies
  await pool.query(
    `UPDATE books
     SET available_copies = available_copies + 1,
         updated_at = NOW()
     WHERE id = $1`,
    [rental.book_id]
  );

  // Mark rental completed
  const result = await pool.query(
    `UPDATE rentals
     SET status = 'COMPLETED',
         returned_at = NOW(),
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [rentalId]
  );
  return result.rows[0];
};
const getRentalUserEmail = async (rentalId) => {
  const result = await pool.query(
    `SELECT u.email, b.title
     FROM rentals r
     JOIN users u ON r.user_id = u.id
     JOIN books b ON r.book_id = b.id
     WHERE r.id = $1`,
    [rentalId]
  );

  if (result.rows.length === 0) {
    throw new Error("Rental not found");
  }

  return result.rows[0];
};

module.exports = {
  requestRental,
  dispatchRental,
  initiateReturn,
  completeRental,
    getRentalUserEmail


};
