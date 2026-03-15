const pool = require("../../config/db");

const getOverviewAnalytics = async () => {
  const totalUsersQuery = pool.query(
    `SELECT COUNT(*) AS total_users FROM users`
  );

  const totalAuthorsQuery = pool.query(
    `SELECT COUNT(*) AS total_authors
     FROM authors
     WHERE approval_status = 'APPROVED'`
  );

  const totalBooksQuery = pool.query(
    `SELECT COUNT(*) AS total_books
     FROM books
     WHERE is_active = true`
  );

  const activeRentalsQuery = pool.query(
    `SELECT COUNT(*) AS active_rentals
     FROM rentals
     WHERE status IN ('REQUESTED', 'DISPATCHED', 'RETURN_INITIATED')`
  );

  const overdueRentalsQuery = pool.query(
    `SELECT COUNT(*) AS overdue_rentals
     FROM rentals
     WHERE due_date < NOW()
     AND status IN ('REQUESTED', 'DISPATCHED', 'RETURN_INITIATED')`
  );

  const [
    totalUsers,
    totalAuthors,
    totalBooks,
    activeRentals,
    overdueRentals
  ] = await Promise.all([
    totalUsersQuery,
    totalAuthorsQuery,
    totalBooksQuery,
    activeRentalsQuery,
    overdueRentalsQuery
  ]);

  return {
    total_users: Number(totalUsers.rows[0].total_users),
    total_authors: Number(totalAuthors.rows[0].total_authors),
    total_books: Number(totalBooks.rows[0].total_books),
    active_rentals: Number(activeRentals.rows[0].active_rentals),
    overdue_rentals: Number(overdueRentals.rows[0].overdue_rentals)
  };
};

const getBookAnalytics = async () => {
  const mostReadQuery = pool.query(
    `SELECT id, title, read_count
     FROM books
     WHERE is_active = true
     ORDER BY read_count DESC, created_at DESC
     LIMIT 5`
  );

  const mostRentedQuery = pool.query(
    `SELECT id, title, rental_count
     FROM books
     WHERE is_active = true
     ORDER BY rental_count DESC, created_at DESC
     LIMIT 5`
  );

  const mostWishlistedQuery = pool.query(
    `SELECT id, title, wishlist_count
     FROM books
     WHERE is_active = true
     ORDER BY wishlist_count DESC, created_at DESC
     LIMIT 5`
  );

  const highestRatedQuery = pool.query(
    `SELECT id, title, avg_rating
     FROM books
     WHERE is_active = true
     ORDER BY avg_rating DESC, created_at DESC
     LIMIT 5`
  );

  const [
    mostRead,
    mostRented,
    mostWishlisted,
    highestRated
  ] = await Promise.all([
    mostReadQuery,
    mostRentedQuery,
    mostWishlistedQuery,
    highestRatedQuery
  ]);

  return {
    most_read: mostRead.rows,
    most_rented: mostRented.rows,
    most_wishlisted: mostWishlisted.rows,
    highest_rated: highestRated.rows
  };
};

module.exports = {
  getOverviewAnalytics,
  getBookAnalytics
};