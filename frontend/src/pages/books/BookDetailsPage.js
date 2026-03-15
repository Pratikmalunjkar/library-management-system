import { requestRental } from "../../api/rentalApi";
import { getBookReviews, addReview } from "../../api/reviewApi";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookById } from "../../api/bookApi";
import { addToWishlist } from "../../api/wishlistApi";
import Navbar from "../../components/Navbar";

function BookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

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

  const fetchReviews = async () => {
    try {
      const data = await getBookReviews(id);
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const data = await addToWishlist(book.id);
      setMessage(data.message || "Added to wishlist");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add to wishlist");
    }
  };

  const handleRentBook = async () => {
    try {
      const data = await requestRental(book.id);
      setMessage(data.message || "Rental request created");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to request rental");
    }
  };

  const handleSubmitReview = async () => {
    try {
      const data = await addReview(book.id, rating, comment);
      setMessage(data.message || "Review added");
      setRating("");
      setComment("");
      fetchReviews();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add review");
    }
  };

  // ✅ Correct handler for reading book
  const handleReadBook = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please login again to read this book");
      return;
    }
    window.open(
      `http://localhost:5000/api/books/read/${book.id}?token=${token}`,
      "_blank"
    );
  };

  useEffect(() => {
    fetchBookDetails();
    fetchReviews();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <p style={{ padding: "30px" }}>Loading book details...</p>
      </>
    );
  }

  if (!book) {
    return (
      <>
        <Navbar />
        <p style={{ padding: "30px" }}>Book not found</p>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <button style={styles.backButton} onClick={() => navigate("/books")}>
          ← Back to Books
        </button>

        <div style={styles.card}>
          <h2>{book.title}</h2>
          <p><strong>Genre:</strong> {book.genre}</p>
          <p><strong>Author:</strong> {book.author_name || "N/A"}</p>
          <p><strong>ISBN:</strong> {book.isbn || "N/A"}</p>
          <p><strong>Publication Date:</strong> {book.publication_date || "N/A"}</p>
          <p><strong>Rating:</strong> {book.avg_rating || "N/A"}</p>
          <p><strong>Available Copies:</strong> {book.available_copies}</p>
          <p><strong>Description:</strong> {book.description || "No description available."}</p>

          <div style={styles.actions}>
            <button
              style={styles.readButton}
              onClick={handleReadBook}   // ✅ updated
            >
              Read Book
            </button>

            <button
              style={styles.wishlistButton}
              onClick={handleAddToWishlist}
            >
              Add to Wishlist
            </button>

            <button
              style={styles.rentButton}
              onClick={handleRentBook}
            >
              Rent Book
            </button>
          </div>

          {message && <p style={styles.message}>{message}</p>}

          {/* Reviews Section */}
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
          <button style={styles.reviewButton} onClick={handleSubmitReview}>
            Submit Review
          </button>
        </div>
      </div>
    </>
  );
}

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
    fontSize: "15px",
  },
  wishlistButton: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#198754",
    color: "#fff",
    cursor: "pointer",
    fontSize: "15px",
  },
  rentButton: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#f59e0b",
    color: "#fff",
    cursor: "pointer",
    fontSize: "15px",
  },
  message: {
    marginTop: "16px",
    color: "#333",
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
};

export default BookDetailsPage;
