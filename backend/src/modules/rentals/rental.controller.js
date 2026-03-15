const pool = require("../../config/db");
const rentalService = require("./rental.service");
const { sendEmail } = require("../../utils/email");

const requestRental = async (req, res) => {
  try {
    const userId = req.user.id;
    const { book_id } = req.body;

    if (!book_id) {
      return res.status(400).json({ message: "book_id is required" });
    }

    const rental = await rentalService.requestRental(userId, book_id);

    // get user email + book title
    const rentalInfo = await rentalService.getRentalUserEmail(rental.id);

    if (rentalInfo.email) {
      await sendEmail(
        rentalInfo.email,
        "Rental Request Confirmation",
        `Your rental request for "${rentalInfo.title}" has been created successfully.`
      );
    }

    res.status(201).json({
      message: "Rental request created",
      rental,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const dispatchRental = async (req, res) => {
  try {
    const rental = await rentalService.dispatchRental(req.params.id);

    const rentalInfo = await rentalService.getRentalUserEmail(rental.id);

    if (rentalInfo.email) {
      await sendEmail(
        rentalInfo.email,
        "Book Dispatch Confirmation",
        `Your rented book "${rentalInfo.title}" has been dispatched successfully.`
      );
    }

    res.status(200).json({
      message: "Rental dispatched successfully",
      rental,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const initiateReturn = async (req, res) => {
  try {
    const rental = await rentalService.initiateReturn(req.params.id);

    // ✅ Notify admin via email
    const rentalInfo = await rentalService.getRentalUserEmail(rental.id);
    const adminEmail = process.env.ADMIN_EMAIL;

    if (adminEmail) {
      await sendEmail(
        adminEmail,
        "Return Initiated by User",
        `User ${rentalInfo.email} has initiated return for book "${rentalInfo.title}". Please confirm receipt.`
      );
    }

    // ✅ Send confirmation to user too
    if (rentalInfo.email) {
      await sendEmail(
        rentalInfo.email,
        "Return Initiated Confirmation",
        `Your return request for "${rentalInfo.title}" has been initiated successfully. Admin will confirm receipt soon.`
      );
    }

    res.status(200).json({
      message: "Return initiated successfully",
      rental,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const completeRental = async (req, res) => {
  try {
    const rental = await rentalService.completeRental(req.params.id);

    const rentalInfo = await rentalService.getRentalUserEmail(rental.id);

    if (rentalInfo.email) {
      await sendEmail(
        rentalInfo.email,
        "Return Completed Confirmation",
        `Your return process for "${rentalInfo.title}" has been completed successfully.`
      );
    }

    res.status(200).json({
      message: "Rental completed successfully",
      rental,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getUserRentals = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT r.id, r.status, r.due_date, b.title
      FROM rentals r
      JOIN books b ON r.book_id = b.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
      `,
      [userId]
    );

    res.json({
      rentals: result.rows,
    });
  } catch (error) {
    console.error("Error fetching rentals:", error);
    res.status(500).json({ message: "Failed to fetch rentals" });
  }
};

// ✅ New function for Admin
const getAllRentals = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        r.id,
        r.status,
        r.due_date,
        b.title,
        u.email
      FROM rentals r
      JOIN books b ON r.book_id = b.id
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `);

    res.json({
      rentals: result.rows,
    });
  } catch (error) {
    console.error("Error fetching all rentals:", error);
    res.status(500).json({ message: "Failed to load rentals" });
  }
};

module.exports = {
  requestRental,
  dispatchRental,
  initiateReturn,
  completeRental,
  getUserRentals,
  getAllRentals,   // ✅ added export
};
