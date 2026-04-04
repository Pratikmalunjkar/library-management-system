const express = require("express");
const router = express.Router();

// Multer middleware for handling file uploads (PDF + cover)
const upload = require("../../middleware/uploadMiddleware");

// Utility to extract cover image from first page of PDF
const { extractCoverFromPdf } = require("../../utils/extractCover");

// Path module to work with file paths
const path = require("path");

// Controllers for book operations
const { 
  addBook,
  listBooks,
  getBookById,
  searchBooks,
  filterBooksByGenre,
  filterBooksByRating,
  filterBooksByPopularity,
  readBookPdf,
  editBook,
  deleteBook
} = require("./book.controller");

// Authentication & Role-based access control
const authenticate = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");


/**
 * ===========================
 * 📚 PUBLIC ROUTES
 * ===========================
 */

// Get all books
router.get("/", listBooks);

// Add book without file (basic JSON)
router.post("/", authenticate, authorizeRoles("ADMIN"), addBook);

// Search and filter routes
router.get("/search", searchBooks);
router.get("/filter", filterBooksByGenre);
router.get("/filter/rating", filterBooksByRating);
router.get("/filter/popularity", filterBooksByPopularity);

// Read PDF (only for logged-in users)
router.get("/read/:id", authenticate, readBookPdf);

// Get single book by ID
router.get("/:id", getBookById);


/**
 * ===========================
 * 🔐 ADMIN ROUTES
 * ===========================
 */

// Edit book details
router.put("/:id", authenticate, authorizeRoles("ADMIN"), editBook);

// Delete a book
router.delete("/:id", authenticate, authorizeRoles("ADMIN"), deleteBook);


/**
 * ===========================
 * 📤 UPLOAD BOOK (PDF + COVER)
 * ===========================
 */
router.post(
  "/upload",
  authenticate,
  authorizeRoles("ADMIN"),

  // Accept multiple files: PDF (required) + cover (optional)
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "cover", maxCount: 1 }
  ]),

  async (req, res) => {
    try {
      // Extract form data from request body
      const {
        title,
        genre,
        description,
        isbn,
        author_name,
        total_copies,
        available_copies
      } = req.body;

      /**
       * ✅ VALIDATION
       */

      // Ensure PDF file is uploaded
      if (!req.files || !req.files.pdf) {
        return res.status(400).json({
          message: "PDF file is required"
        });
      }

      /**
       * 📂 FILE HANDLING
       */

      // Get uploaded PDF file
      const pdfFile = req.files.pdf[0];

      // Store path reference for PDF (used later for reading)
      const pdf_storage_key = `books/${pdfFile.filename}`;

      let cover_image_url;

      // If user uploaded a cover image → use it
      if (req.files.cover) {
        cover_image_url = `covers/${req.files.cover[0].filename}`;
      } else {
        // Otherwise → auto extract cover from first page of PDF

        const coverFileName = `cover-${Date.now()}.jpg`;

        // Full path to stored PDF file
        const pdfFullPath = path.join(
          process.cwd(),
          "storage/books",
          pdfFile.filename
        );

        // Extract cover image using utility function
        cover_image_url = await extractCoverFromPdf(
          pdfFullPath,
          coverFileName
        );
      }

      /**
       * 🗄️ DATABASE INSERT
       */

      const pool = require("../../config/db");

      const result = await pool.query(
        `INSERT INTO books
         (title, genre, description, isbn, author_name,
          pdf_storage_key, cover_image_url, total_copies, available_copies)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         RETURNING *`,
        [
          title,
          genre,
          description || null,
          isbn || null,
          author_name || null,
          pdf_storage_key,
          cover_image_url,
          total_copies || 1,
          available_copies || 1
        ]
      );

      /**
       * ✅ SUCCESS RESPONSE
       */

      res.status(201).json({
        message: "Book added successfully",
        book: result.rows[0]
      });

    } catch (err) {
      console.error("Upload Error:", err);

      /**
       * ❌ ERROR RESPONSE
       */
      res.status(500).json({
        message: "Failed to add book"
      });
    }
  }
);

// Export router
module.exports = router;