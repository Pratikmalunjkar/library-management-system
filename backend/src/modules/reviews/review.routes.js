const express = require("express");
const router = express.Router();

const { addReview, getReviewsByBook, deleteReview } = require("./review.controller");
const authenticate = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Add a review
 *     tags: [Reviews]
 *     responses:
 *       201:
 *         description: Review added successfully
 */
router.post("/", authenticate, addReview);

/**
 * @swagger
 * /api/reviews/book/{bookId}:
 *   get:
 *     summary: Get all reviews for a book
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reviews fetched
 */
router.get("/book/:bookId", authenticate, getReviewsByBook);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review (Admin only)
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted
 */
router.delete("/:id", authenticate, authorizeRoles("ADMIN"), deleteReview);

module.exports = router;
