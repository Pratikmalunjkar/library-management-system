// ✅ API imports
import { requestRental } from "../../api/rentalApi";
import { getBookReviews, addReview } from "../../api/reviewApi";
import { getBookById } from "../../api/bookApi";
import { addToWishlist } from "../../api/wishlistApi";

// ✅ React + Router imports
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// ✅ Components & utils
import Navbar from "../../components/Navbar";
import { getUserRole } from "../../utils/getUserRole";

function BookDetailsPage() {
  // ✅ Get book ID from URL
  const { id } = useParams();

  // ✅ Navigation hook
  const navigate = useNavigate();

  // ✅ State for book details
  const [book, setBook] = useState(null);

  // ✅ Loading state
  const [loading, setLoading] = useState(true);

  // ✅ Success / error message
  const [message, setMessage] = useState("");

  // ✅ Reviews state
  const [reviews, setReviews] = useState([]);

  // ✅ Review form inputs
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  // ✅ Get logged-in user role (USER / AUTHOR / ADMIN)
  const role = getUserRole();

  // =========================
  // 📌 FETCH BOOK DETAILS
  // =========================
  const fetchBookDetails = async () => {
    try {
      const data = await getBookById(id);
      setBook(data.book || null);
    } catch (error) {
      console.error("Failed to fetch book details", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 📌 FETCH REVIEWS
  // =========================
  const fetchReviews = async () => {
    try {
      const data = await getBookReviews(id);
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  };

  // =========================
  // 📌 ADD TO WISHLIST
  // =========================
  const handleAddToWishlist = async () => {
    try {
      const data = await addToWishlist(book.id);
      setMessage(data.message || "Added to wishlist");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add to wishlist");
    }
  };

  // =========================
  // 📌 RENT BOOK
  // =========================
  const handleRentBook = async () => {
    try {
      const data = await requestRental(book.id);
      setMessage(data.message || "Rental request created");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to request rental");
    }
  };

  // =========================
  // 📌 SUBMIT REVIEW
  // =========================
  const handleSubmitReview = async () => {
    try {
      const data = await addReview(book.id, rating, comment);

      // Reset form
      setRating("");
      setComment("");

      // Refresh reviews
      fetchReviews();

      setMessage(data.message || "Review added");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add review");
    }
  };

  // =========================
  // 📌 READ BOOK HANDLER
  // =========================
  const handleReadBook = () => {
    const token = localStorage.getItem("token");

    // If not logged in
    if (!token) {
      setMessage("Please login again to read this book");
      return;
    }

    // Navigate to reader page
    navigate(`/books/${book.id}/read`);
  };

  // =========================
  // 📌 LOAD DATA ON PAGE LOAD
  // =========================
  useEffect(() => {
    fetchBookDetails();
    fetchReviews();
  }, [id]);

  // =========================
  // 📌 LOADING STATE UI
  // =========================
  if (loading) {
    return (
      <>
        <Navbar />
        <p style={{ padding: "30px" }}>Loading book details...</p>
      </>
    );
  }

  // =========================
  // 📌 BOOK NOT FOUND UI
  // =========================
  if (!book) {
    return (
      <>
        <Navbar />
        <p style={{ padding: "30px" }}>Book not found</p>
      </>
    );
  }

  // =========================
  // 📌 MAIN UI
  // =========================
  return (
    <>
      <Navbar />

      <div style={styles.page}>
        {/* Back button */}
        <button style={styles.backButton} onClick={() => navigate("/books")}>
          ← Back to Books
        </button>

        <div style={styles.card}>
          
          {/* Book cover */}
          {book.cover_image_url && (
            <img
              src={`http://localhost:5000/${book.cover_image_url}`}
              alt={book.title}
              style={styles.coverImage}
              onError={(e) => { e.target.style.display = "none"; }}
            />
          )}

          {/* Book details */}
          <h2>{book.title}</h2>
          <p><strong>Genre:</strong> {book.genre}</p>
          <p><strong>Author:</strong> {book.author_name || "N/A"}</p>
          <p><strong>ISBN:</strong> {book.isbn || "N/A"}</p>
          <p><strong>Publication Date:</strong> {book.publication_date || "N/A"}</p>
          <p><strong>Rating:</strong> {book.avg_rating || "N/A"}</p>
          <p><strong>Available Copies:</strong> {book.available_copies}</p>
          <p><strong>Description:</strong> {book.description || "No description available."}</p>

          {/* ================= ACTION BUTTONS ================= */}
          <div style={styles.actions}>

            {/* ✅ Read Book (all roles, only if PDF exists) */}
            {book.pdf_storage_key ? (
              <button
                style={styles.readButton}
                onClick={handleReadBook}
              >
                Read Book
              </button>
            ) : (
              <button
                style={{ ...styles.readButton, backgroundColor: "#aaa", cursor: "not-allowed" }}
                disabled
              >
                PDF Not Available
              </button>
            )}

            {/* ✅ Wishlist (only USER) */}
            {role === "USER" && (
              <button
                style={styles.wishlistButton}
                onClick={handleAddToWishlist}
              >
                Add to Wishlist
              </button>
            )}

            {/* ✅ Rent (only USER) */}
            {role === "USER" && (
              <button
                style={styles.rentButton}
                onClick={handleRentBook}
              >
                Rent Book
              </button>
            )}
          </div>

          {/* Message */}
          {message && <p style={styles.message}>{message}</p>}

          {/* ================= REVIEWS ================= */}
          <h3 style={{ marginTop: "30px" }}>Reviews</h3>

          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} style={styles.reviewCard}>
                <p><strong>Rating:</strong> {r.rating}</p>
                <p>{r.comment}</p>
              </div>
            ))
          )}

          {/* ✅ Add Review (only USER) */}
          {role === "USER" && (
            <>
              <h3 style={{ marginTop: "30px" }}>Add Review</h3>

              <input
                type="number"
                placeholder="Rating (1-5)"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                style={styles.input}
              />

              <textarea
                placeholder="Write your review"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={styles.textarea}
              />

              <button
                style={styles.reviewButton}
                onClick={handleSubmitReview}
              >
                Submit Review
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// =========================
// 🎨 STYLES
// =========================
const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f4f6f8",
    padding: "40px",
  },
  backButton: {
    marginBottom: "20px",
    padding: "10px 14px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#555",
    color: "#fff",
    cursor: "pointer",
  },
  card: {
    maxWidth: "700px",
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "20px",
  },
  readButton: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#1f6feb",
    color: "#fff",
    cursor: "pointer",
  },
  wishlistButton: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#198754",
    color: "#fff",
    cursor: "pointer",
  },
  rentButton: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#f59e0b",
    color: "#fff",
    cursor: "pointer",
  },
  message: {
    marginTop: "16px",
  },
  reviewCard: {
    border: "1px solid #ddd",
    padding: "10px",
    borderRadius: "6px",
    marginTop: "10px",
  },
  input: {
    padding: "10px",
    marginTop: "10px",
    width: "100%",
  },
  textarea: {
    padding: "10px",
    marginTop: "10px",
    width: "100%",
    minHeight: "80px",
  },
  reviewButton: {
    marginTop: "10px",
    padding: "10px 16px",
    backgroundColor: "#6f42c1",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  coverImage: {
    width: "200px",
    height: "280px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
};

export default BookDetailsPage;