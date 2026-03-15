const express = require("express");
const router = express.Router();

const {
  getOverviewAnalytics,
  getBookAnalytics
} = require("./analytics.controller");

const authenticate = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

/**
 * @swagger
 * /api/admin/analytics/overview:
 *   get:
 *     summary: Get overview analytics (Admin only)
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Overview analytics fetched
 */
router.get("/overview", authenticate, authorizeRoles("ADMIN"), getOverviewAnalytics);

/**
 * @swagger
 * /api/admin/analytics/books:
 *   get:
 *     summary: Get book analytics (Admin only)
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Book analytics fetched
 */
router.get("/books", authenticate, authorizeRoles("ADMIN"), getBookAnalytics);

module.exports = router;
