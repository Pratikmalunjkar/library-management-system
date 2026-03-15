const wishlistService = require("./wishlist.service");

const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { book_id } = req.body;

    if (!book_id) {
      return res.status(400).json({ message: "book_id is required" });
    }

    const wishlistItem = await wishlistService.addToWishlist(userId, book_id);

    res.status(201).json({
      message: "Book added to wishlist successfully",
      wishlist: wishlistItem
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const getUserWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const books = await wishlistService.getUserWishlist(userId);

    res.status(200).json({ books });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookId = req.params.bookId;

    const removedItem = await wishlistService.removeFromWishlist(userId, bookId);

    res.status(200).json({
      message: "Book removed from wishlist successfully",
      wishlist: removedItem
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { addToWishlist, getUserWishlist, removeFromWishlist };