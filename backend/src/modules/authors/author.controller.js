const authorService = require("./author.service");
const pool = require("../../config/db");

/* ===============================
   USER → APPLY FOR AUTHOR
================================= */

const applyForAuthor = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ handle uploaded photo
    let profile_photo_url = req.body.profile_photo_url || null;
    if (req.file) {
      profile_photo_url = `storage/books/${req.file.filename}`;
    }

    const author = await authorService.applyForAuthor(userId, {
      ...req.body,
      profile_photo_url
    });

    res.status(201).json({
      message: "Author application submitted successfully",
      author
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


/* ===============================
   USER → CHECK OWN AUTHOR STATUS
================================= */

const getMyAuthorStatus = async (req, res) => {
  try {

    const userId = req.user.id;

    const author = await authorService.getMyAuthorStatus(userId);

    res.status(200).json({ author });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


/* ===============================
   ADMIN → VIEW PENDING AUTHORS
================================= */

const getPendingAuthors = async (req, res) => {
  try {

    const authors = await authorService.getPendingAuthors();

    res.status(200).json({ authors });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


/* ===============================
   ADMIN → APPROVE AUTHOR
================================= */

const approveAuthor = async (req, res) => {
  try {

    const author = await authorService.approveAuthor(req.params.id);

    res.status(200).json({
      message: "Author approved successfully",
      author
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


/* ===============================
   ADMIN → REJECT AUTHOR
================================= */

const rejectAuthor = async (req, res) => {
  try {

    const author = await authorService.rejectAuthor(
      req.params.id,
      req.body.rejection_reason
    );

    res.status(200).json({
      message: "Author rejected successfully",
      author
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


/* ===============================
   AUTHOR → SUBMIT BOOK
================================= */

const submitBook = async (req, res) => {
  try {
    const { title, genre, description } = req.body;

    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    const pdfKey = `books/${req.files.pdf[0].filename}`;
    const coverKey = req.files.cover
      ? `covers/${req.files.cover[0].filename}`
      : null;

    const author = await pool.query(
      "SELECT id FROM authors WHERE user_id = $1",
      [req.user.id]
    );

    if (author.rows.length === 0) {
      return res.status(404).json({ message: "Author profile not found" });
    }

    const authorId = author.rows[0].id;

    const result = await pool.query(
      `INSERT INTO book_submissions
       (author_id, title, genre, description, manuscript_storage_key, cover_image_url)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [authorId, title, genre, description, pdfKey, coverKey]
    );

    res.status(201).json({
      message: "Book submitted successfully",
      submission: result.rows[0]
    });

  } catch (error) {
    console.error("Submit book error:", error);
    res.status(500).json({ message: "Failed to submit book" });
  }
};


/* ===============================
   AUTHOR → VIEW OWN SUBMISSIONS
================================= */

const getMySubmissions = async (req, res) => {
  try {

    const userId = req.user.id;

    const submissions = await authorService.getMySubmissions(userId);

    res.status(200).json({ submissions });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


/* ===============================
   AUTHOR → DASHBOARD METRICS
================================= */

const getAuthorMetrics = async (req, res) => {
  try {

    const userId = req.user.id;

    const metrics = await authorService.getAuthorMetrics(userId);

    res.status(200).json({ metrics });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


/* ===============================
   AUTHOR → UPDATE SUBMISSION
================================= */

const updateSubmission = async (req, res) => {
  try {

    const userId = req.user.id;

    const submission = await authorService.updateSubmission(
      userId,
      req.params.id,
      req.body
    );

    res.status(200).json({
      message: "Submission updated successfully",
      submission
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


/* ===============================
   ADMIN → VIEW PENDING SUBMISSIONS
================================= */

const getPendingSubmissions = async (req, res) => {
  try {

    const submissions = await authorService.getPendingSubmissions();

    res.status(200).json({ submissions });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


/* ===============================
   ADMIN → APPROVE BOOK SUBMISSION
================================= */

const approveSubmission = async (req, res) => {
  try {

    const result = await authorService.approveSubmission(req.params.id);

    res.status(200).json({
      message: "Submission approved successfully",
      result
    });

  } catch (err) {
    res.status(400).json({ messaFage: err.message });
  }
};


/* ===============================
   ADMIN → REJECT BOOK SUBMISSION
================================= */

const rejectSubmission = async (req, res) => {
  try {

    const submission = await authorService.rejectSubmission(
      req.params.id,
      req.body.admin_comment
    );

    res.status(200).json({
      message: "Submission rejected successfully",
      submission
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


/* ===============================
   EXPORTS
================================= */

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
  getPendingSubmissions,
  approveSubmission,
  rejectSubmission
};