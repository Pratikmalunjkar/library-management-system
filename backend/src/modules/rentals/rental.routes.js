const express = require("express");
const router = express.Router();

const {
  requestRental,
  dispatchRental,
  initiateReturn,
  completeRental,
  getUserRentals,
  getAllRentals   // ✅ make sure this is imported
} = require("./rental.controller");

const authenticate = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

/**
 * @swagger
 * /api/rentals/request:
 *   post:
 *     summary: Request a rental
 *     tags: [Rentals]
 *     responses:
 *       201:
 *         description: Rental request created
 */
router.post("/request", authenticate, authorizeRoles("USER"), requestRental);


router.get("/me", authenticate, getUserRentals);

/**
 * @swagger
 * /api/rentals/{id}/dispatch:
 *   patch:
 *     summary: Dispatch a rental (Admin only)
 *     tags: [Rentals]
 */
router.patch("/:id/dispatch", authenticate, authorizeRoles("ADMIN"), dispatchRental);

/**
 * @swagger
 * /api/rentals/{id}/return:
 *   patch:
 *     summary: Initiate return for a rental
 *     tags: [Rentals]
 */
router.patch("/:id/return", authenticate, initiateReturn);

/**
 * @swagger
 * /api/rentals/{id}/complete:
 *   patch:
 *     summary: Complete a rental (Admin only)
 *     tags: [Rentals]
 */
router.patch("/:id/complete", authenticate, authorizeRoles("ADMIN"), completeRental);

/**
 * @swagger
 * /api/rentals:
 *   get:
 *     summary: Get all rentals (Admin only)
 *     tags: [Rentals]
 */
router.get("/", authenticate, authorizeRoles("ADMIN"), getAllRentals);

module.exports = router;
