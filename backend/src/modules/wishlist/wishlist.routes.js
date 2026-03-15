const express = require("express");
const router = express.Router();
const { addToWishlist, getUserWishlist, removeFromWishlist } = require("./wishlist.controller");
const authenticate = require("../../middleware/authMiddleware");

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: View user wishlist
 *     tags: [Wishlist]
 *     responses:
 *       200:
 *         description: Wishlist fetched
 *   post:
 *     summary: Add a book to wishlist
 *     tags: [Wishlist]
 *     responses:
 *       201:
 *         description: Book added to wishlist
 */
router.get("/", authenticate, getUserWishlist);
router.post("/", authenticate, addToWishlist);

/**
 * @swagger
 * /api/wishlist/{bookId}:
 *   delete:
 *     summary: Remove a book from wishlist
 *     tags: [Wishlist]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book removed from wishlist
 */
router.delete("/:bookId", authenticate, removeFromWishlist);

module.exports = router;
