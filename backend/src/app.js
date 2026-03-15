const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./config/db");

const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
const bookRoutes = require("./modules/books/book.routes");
const rentalRoutes = require("./modules/rentals/rental.routes");

const wishlistRoutes = require("./modules/wishlist/wishlist.routes");

const reviewRoutes = require("./modules/reviews/review.routes");

const analyticsRoutes = require("./modules/analytics/analytics.routes");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const authorRoutes = require("./modules/authors/author.routes");


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());



// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Library Management Backend is running"
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);

app.use("/api/admin/analytics", analyticsRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/authors", authorRoutes);
module.exports = app;