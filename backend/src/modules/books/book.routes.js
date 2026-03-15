const express = require("express");
const router = express.Router();
const upload = require("../../middleware/uploadMiddleware");

const { 
  addBook,
  listBooks,
  getBookById,
  searchBooks,
  filterBooksByGenre,
  filterBooksByRating,
  filterBooksByPopularity,
  readBookPdf,
  editBook,        // ✅ added
  deleteBook       // ✅ added
} = require("./book.controller");

const authenticate = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *   post:
 *     summary: Add a new book (Admin only)
 *     tags: [Books]
 */
router.get("/", listBooks);
router.post("/", authenticate, authorizeRoles("ADMIN"), addBook);

router.get("/search", searchBooks);
router.get("/filter", filterBooksByGenre);
router.get("/filter/rating", filterBooksByRating);
router.get("/filter/popularity", filterBooksByPopularity);

router.get("/read/:id", authenticate, readBookPdf);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get book details by ID
 *     tags: [Books]
 */
router.get("/:id", getBookById);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Edit a book (Admin only)
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book updated successfully
 */
router.put("/:id", authenticate, authorizeRoles("ADMIN"), editBook);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book (Admin only)
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book deleted successfully
 */
router.delete("/:id", authenticate, authorizeRoles("ADMIN"), deleteBook);
// ✅ Admin upload book with PDF
router.post("/upload", authenticate, authorizeRoles("ADMIN"), upload.single("pdf"), async (req, res) => {
  try {
    const {
      title, genre, description, isbn,
      author_name, total_copies, available_copies
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    const pdf_storage_key = `books/${req.file.filename}`;

    const pool = require("../../config/db");
    const result = await pool.query(
      `INSERT INTO books
       (title, genre, description, isbn, author_name,
        pdf_storage_key, total_copies, available_copies)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [
        title, genre, description || null,
        isbn || null, author_name || null,
        pdf_storage_key,
        total_copies || 1,
        available_copies || 1
      ]
    );

    res.status(201).json({
      message: "Book added successfully",
      book: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add book" });
  }
});

module.exports = router;
