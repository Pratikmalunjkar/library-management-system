const express = require("express");
const router = express.Router();

const {
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
} = require("./author.controller");

const authenticate = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");
const upload = require("../../middleware/uploadMiddleware");

// user applies to become author
router.post("/apply", authenticate, upload.single("photo"), applyForAuthor);


// author checks own application status
router.get("/me/status", authenticate, getMyAuthorStatus);

// admin views pending author applications
router.get("/pending", authenticate, authorizeRoles("ADMIN"), getPendingAuthors);

// admin approves author
router.patch("/:id/approve", authenticate, authorizeRoles("ADMIN"), approveAuthor);

// admin rejects author
router.patch("/:id/reject", authenticate, authorizeRoles("ADMIN"), rejectAuthor);

// ✅ approved author submits book manuscript (with file upload)
router.post(
  "/submissions",
  authenticate,
  authorizeRoles("AUTHOR"),
  upload.single("pdf"),
  submitBook
);

// author views own submissions
router.get("/submissions/me", authenticate, authorizeRoles("AUTHOR"), getMySubmissions);

// author edits own pending submission
router.patch("/submissions/:id", authenticate, authorizeRoles("AUTHOR"), updateSubmission);

// author views own metrics
router.get("/metrics/me", authenticate, authorizeRoles("AUTHOR"), getAuthorMetrics);

// admin views pending submissions
router.get("/submissions/pending", authenticate, authorizeRoles("ADMIN"), getPendingSubmissions);

// admin approves submission
router.patch("/submissions/:id/approve", authenticate, authorizeRoles("ADMIN"), approveSubmission);

// admin rejects submission
router.patch("/submissions/:id/reject", authenticate, authorizeRoles("ADMIN"), rejectSubmission);
const pool = require("../../config/db");

// ✅ Admin: get all authors
router.get("/", authenticate, authorizeRoles("ADMIN"), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, u.full_name, u.email
       FROM authors a
       JOIN users u ON a.user_id = u.id
       ORDER BY a.created_at DESC`
    );
    res.json({ authors: result.rows });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch authors" });
  }
});

module.exports = router;
