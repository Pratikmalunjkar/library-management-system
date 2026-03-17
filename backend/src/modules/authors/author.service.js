const pool = require("../../config/db");

const applyForAuthor = async (userId, data) => {
  const { biography, qualifications, experience, profile_photo_url } = data;

  const existingAuthor = await pool.query(
    `SELECT * FROM authors WHERE user_id = $1`,
    [userId]
  );

  if (existingAuthor.rows.length > 0) {
    throw new Error("Author application already exists");
  }

  const result = await pool.query(
    `INSERT INTO authors
     (user_id, biography, qualifications, experience, profile_photo_url, approval_status)
     VALUES ($1, $2, $3, $4, $5, 'PENDING')
     RETURNING *`,
    [userId, biography, qualifications, experience, profile_photo_url]
  );

  return result.rows[0];
};
const getMyAuthorStatus = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM authors WHERE user_id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error("Author application not found");
  }

  const author = result.rows[0];

  // ✅ Auto fix - if approved but user_role not updated
  if (author.approval_status === 'APPROVED') {
    await pool.query(
      `UPDATE users 
       SET user_role = 'AUTHOR', updated_at = NOW()
       WHERE id = $1 AND user_role != 'AUTHOR'`,
      [userId]
    );
  }

  return author;
};

const getPendingAuthors = async () => {
  const result = await pool.query(
    `SELECT a.*, u.full_name, u.email
     FROM authors a
     JOIN users u ON a.user_id = u.id
     WHERE a.approval_status = 'PENDING'
     ORDER BY a.created_at DESC`
  );

  return result.rows;
};

const approveAuthor = async (authorId) => {
  const result = await pool.query(
    `UPDATE authors
     SET approval_status = 'APPROVED',
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [authorId]
  );

  if (result.rows.length === 0) {
    throw new Error("Author not found");
  }

  const author = result.rows[0];

  // ✅ Update user_role to AUTHOR
  const userUpdate = await pool.query(
    `UPDATE users
     SET user_role = 'AUTHOR',
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, email, user_role`,
    [author.user_id]
  );

  // ✅ Debug log to confirm
  console.log("User role updated:", userUpdate.rows[0]);

  return author;
};

const rejectAuthor = async (authorId, rejectionReason) => {
  const result = await pool.query(
    `UPDATE authors
     SET approval_status = 'REJECTED',
         rejection_reason = $2,
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [authorId, rejectionReason || "Application rejected"]
  );

  if (result.rows.length === 0) {
    throw new Error("Author not found");
  }

  return result.rows[0];
};

const submitBook = async (userId, data) => {
  const {
    title,
    genre,
    description,
    isbn,
    publication_date,
    cover_image_url,
    manuscript_storage_key
  } = data;

  const authorResult = await pool.query(
    `SELECT * FROM authors
     WHERE user_id = $1 AND approval_status = 'APPROVED'`,
    [userId]
  );

  if (authorResult.rows.length === 0) {
    throw new Error("Approved author profile not found");
  }

  const author = authorResult.rows[0];

  const result = await pool.query(
    `INSERT INTO book_submissions
     (author_id, title, genre, description, isbn, publication_date, cover_image_url, manuscript_storage_key, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDING')
     RETURNING *`,
    [
      author.id,
      title,
      genre,
      description || null,
      isbn || null,
      publication_date || null,
      cover_image_url || null,
      manuscript_storage_key
    ]
  );

  return result.rows[0];
};

const getMySubmissions = async (userId) => {
  const authorResult = await pool.query(
    `SELECT * FROM authors WHERE user_id = $1`,
    [userId]
  );

  if (authorResult.rows.length === 0) {
    throw new Error("Author profile not found");
  }

  const author = authorResult.rows[0];

  const result = await pool.query(
    `SELECT *
     FROM book_submissions
     WHERE author_id = $1
     ORDER BY created_at DESC`,
    [author.id]
  );

  return result.rows;
};

const getAuthorMetrics = async (userId) => {
  const authorResult = await pool.query(
    `SELECT * FROM authors WHERE user_id = $1 AND approval_status = 'APPROVED'`,
    [userId]
  );

  if (authorResult.rows.length === 0) {
    throw new Error("Approved author profile not found");
  }

  const author = authorResult.rows[0];

  const booksResult = await pool.query(
    `SELECT COUNT(*) AS total_books FROM books WHERE author_id = $1`,
    [author.id]
  );

  const pendingResult = await pool.query(
    `SELECT COUNT(*) AS pending FROM book_submissions
     WHERE author_id = $1 AND status='PENDING'`,
    [author.id]
  );

  const approvedResult = await pool.query(
    `SELECT COUNT(*) AS approved FROM book_submissions
     WHERE author_id = $1 AND status='APPROVED'`,
    [author.id]
  );

  const readsResult = await pool.query(
    `SELECT COALESCE(SUM(read_count), 0) AS total_reads
     FROM books WHERE author_id = $1`,
    [author.id]
  );

  const rentalsResult = await pool.query(
    `SELECT COALESCE(SUM(rental_count), 0) AS total_rentals
     FROM books WHERE author_id = $1`,
    [author.id]
  );

  const ratingsResult = await pool.query(
    `SELECT COALESCE(AVG(avg_rating), 0) AS avg_rating
     FROM books WHERE author_id = $1`,
    [author.id]
  );

  const reviewsResult = await pool.query(
    `SELECT COUNT(*) AS total_reviews
     FROM reviews r
     JOIN books b ON r.book_id = b.id
     WHERE b.author_id = $1`,
    [author.id]
  );

  return {
    total_books: Number(booksResult.rows[0].total_books),
    pending_submissions: Number(pendingResult.rows[0].pending),
    approved_books: Number(approvedResult.rows[0].approved),
    total_reads: Number(readsResult.rows[0].total_reads),
    total_rentals: Number(rentalsResult.rows[0].total_rentals),
    avg_rating: parseFloat(ratingsResult.rows[0].avg_rating).toFixed(1),
    total_reviews: Number(reviewsResult.rows[0].total_reviews),
  };
};
const updateSubmission = async (userId, submissionId, data) => {
  const authorResult = await pool.query(
    `SELECT * FROM authors
     WHERE user_id = $1`,
    [userId]
  );

  if (authorResult.rows.length === 0) {
    throw new Error("Author profile not found");
  }

  const author = authorResult.rows[0];

  const submissionResult = await pool.query(
    `SELECT * FROM book_submissions
     WHERE id = $1 AND author_id = $2`,
    [submissionId, author.id]
  );

  if (submissionResult.rows.length === 0) {
    throw new Error("Submission not found");
  }

  const submission = submissionResult.rows[0];

  if (submission.status !== "PENDING") {
    throw new Error("Only pending submissions can be edited");
  }

  const {
    title,
    genre,
    description,
    isbn,
    publication_date,
    cover_image_url,
    manuscript_storage_key
  } = data;

  const result = await pool.query(
    `UPDATE book_submissions
     SET title = $1,
         genre = $2,
         description = $3,
         isbn = $4,
         publication_date = $5,
         cover_image_url = $6,
         manuscript_storage_key = $7,
         updated_at = NOW()
     WHERE id = $8
     RETURNING *`,
    [
      title ?? submission.title,
      genre ?? submission.genre,
      description ?? submission.description,
      isbn ?? submission.isbn,
      publication_date ?? submission.publication_date,
      cover_image_url ?? submission.cover_image_url,
      manuscript_storage_key ?? submission.manuscript_storage_key,
      submissionId
    ]
  );

  return result.rows[0];
};

const approveSubmission = async (submissionId) => {
  const submissionResult = await pool.query(
    `SELECT * FROM book_submissions
     WHERE id = $1`,
    [submissionId]
  );

  if (submissionResult.rows.length === 0) {
    throw new Error("Submission not found");
  }

  const submission = submissionResult.rows[0];

  if (submission.status !== "PENDING") {
    throw new Error("Only pending submissions can be approved");
  }

  const bookResult = await pool.query(
  `INSERT INTO books
   (title, author_id, genre, description, pdf_storage_key, total_copies, available_copies)
   VALUES ($1,$2,$3,$4,$5,1,1)
   RETURNING *`,
  [
    submission.title,
    submission.author_id,
    submission.genre,
    submission.description,
    submission.manuscript_storage_key
  ]
);

  const updatedSubmission = await pool.query(
    `UPDATE book_submissions
     SET status = 'APPROVED',
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [submissionId]
  );

  return {
    submission: updatedSubmission.rows[0],
    book: bookResult.rows[0]
  };
};

const rejectSubmission = async (submissionId, adminComment) => {
  const result = await pool.query(
    `UPDATE book_submissions
     SET status = 'REJECTED',
         admin_comment = $2,
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [submissionId, adminComment || "Submission rejected"]
  );

  if (result.rows.length === 0) {
    throw new Error("Submission not found");
  }

  return result.rows[0];
};

const getPendingSubmissions = async () => {
  const result = await pool.query(
    `SELECT bs.*, u.full_name
     FROM book_submissions bs
     JOIN authors a ON bs.author_id = a.id
     JOIN users u ON a.user_id = u.id
     WHERE bs.status = 'PENDING'
     ORDER BY bs.created_at DESC`
  );

  return result.rows;
};

module.exports = {
  applyForAuthor,
  getMyAuthorStatus,
  getPendingAuthors,
  approveAuthor,
  rejectAuthor,
  submitBook,
  getMySubmissions,
  getAuthorMetrics,
  updateSubmission,
  approveSubmission,
  rejectSubmission,
  getPendingSubmissions
};