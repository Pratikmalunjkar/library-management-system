const pool = require("../../config/db");

const addBook = async (data) => {
  const {
    title,
    author_id,
    author_name,
    genre,
    description,
    isbn,
    publication_date,
    cover_image_url,
    pdf_storage_key,
    total_copies,
    available_copies
  } = data;

  if (!title || !genre || !pdf_storage_key) {
    throw new Error("title, genre, and pdf_storage_key are required");
  }

  const result = await pool.query(
    `INSERT INTO books
     (title, author_id, author_name, genre, description, isbn, publication_date,
      cover_image_url, pdf_storage_key, total_copies, available_copies)
     VALUES
     ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING *`,
    [
      title,
      author_id || null,
      author_name || null,
      genre,
      description || null,
      isbn || null,
      publication_date || null,
      cover_image_url || null,
      pdf_storage_key,
      total_copies || 0,
      available_copies || 0
    ]
  );

  return result.rows[0];
};

const listBooks = async () => {
  const result = await pool.query(
    `SELECT
      id, title, author_name, genre, description, isbn, publication_date,
      cover_image_url,
      total_copies, available_copies,
      avg_rating, review_count,
      wishlist_count, read_count, rental_count,
      is_active,
      created_at
     FROM books
     WHERE is_active = true
     ORDER BY created_at DESC`
  );

  return result.rows;
};

const getBookById = async (id) => {
  const result = await pool.query(
    `SELECT *
     FROM books
     WHERE id = $1 AND is_active = true`,
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error("Book not found");
  }

  return result.rows[0];
};
const searchBooks = async (query) => {
  const result = await pool.query(
    `SELECT *
     FROM books
     WHERE is_active = true
     AND (
       LOWER(title) LIKE LOWER($1)
       OR LOWER(author_name) LIKE LOWER($1)
       OR LOWER(genre) LIKE LOWER($1)
     )
     ORDER BY created_at DESC`,
    [`%${query}%`]
  );

  return result.rows;
};
const filterBooksByGenre = async (genre) => {
  const result = await pool.query(
    `SELECT *
     FROM books
     WHERE is_active = true
     AND LOWER(genre) = LOWER($1)
     ORDER BY created_at DESC`,
    [genre]
  );

  return result.rows;
};

const filterBooksByRating = async (minRating) => {
  const result = await pool.query(
    `SELECT *
     FROM books
     WHERE is_active = true
     AND avg_rating >= $1
     ORDER BY avg_rating DESC, created_at DESC`,
    [minRating]
  );

  return result.rows;
};
const filterBooksByPopularity = async () => {
  const result = await pool.query(
    `SELECT *
     FROM books
     WHERE is_active = true
     ORDER BY (read_count + rental_count + wishlist_count) DESC,
              created_at DESC`
  );

  return result.rows;
};

const getBookPdfKey = async (id) => {
  const result = await pool.query(
    `SELECT pdf_storage_key
     FROM books
     WHERE id = $1 AND is_active = true`,
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error("Book not found");
  }

  return result.rows[0].pdf_storage_key;
};
const editBook = async (id, data) => {
  const {
    title, author_name, genre, description,
    isbn, publication_date, cover_image_url,
    total_copies, available_copies
  } = data;

  const existing = await pool.query(
    `SELECT * FROM books WHERE id = $1 AND is_active = true`, [id]
  );

  if (existing.rows.length === 0) throw new Error("Book not found");
  const book = existing.rows[0];

  const result = await pool.query(
    `UPDATE books SET
      title = $1, author_name = $2, genre = $3,
      description = $4, isbn = $5, publication_date = $6,
      cover_image_url = $7, total_copies = $8,
      available_copies = $9, updated_at = NOW()
     WHERE id = $10 RETURNING *`,
    [
      title ?? book.title,
      author_name ?? book.author_name,
      genre ?? book.genre,
      description ?? book.description,
      isbn ?? book.isbn,
      publication_date ?? book.publication_date,
      cover_image_url ?? book.cover_image_url,
      total_copies ?? book.total_copies,
      available_copies ?? book.available_copies,
      id
    ]
  );

  return result.rows[0];
};

const deleteBook = async (id) => {
  const result = await pool.query(
    `UPDATE books SET is_active = false, updated_at = NOW()
     WHERE id = $1 AND is_active = true RETURNING *`,
    [id]
  );

  if (result.rows.length === 0) throw new Error("Book not found");
  return result.rows[0];
};


module.exports = { addBook, listBooks, getBookById, searchBooks, filterBooksByGenre, filterBooksByRating, filterBooksByPopularity, getBookPdfKey, editBook, deleteBook };