import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import apiClient from "../../api/apiClient";

function AdminReviewsPage() {
  const [bookId, setBookId] = useState("");
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState("");

  const fetchReviews = async () => {
    if (!bookId.trim()) return;
    try {
      const res = await apiClient.get(`/reviews/book/${bookId}`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      setMessage("Failed to fetch reviews");
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await apiClient.delete(`/reviews/${reviewId}`);
      setMessage("Review deleted");
      fetchReviews();
    } catch (err) {
      setMessage("Failed to delete review");
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <h2>Moderate Reviews</h2>
        {message && <p style={styles.message}>{message}</p>}

        <div style={styles.searchRow}>
          <input
            placeholder="Enter Book ID"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            style={styles.input}
          />
          <button style={styles.btn} onClick={fetchReviews}>Fetch Reviews</button>
        </div>

        {reviews.length === 0 ? (
          <p>No reviews found.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} style={styles.card}>
              <p><strong>User:</strong> {r.full_name}</p>
              <p><strong>Rating:</strong> {r.rating} / 5</p>
              <p><strong>Comment:</strong> {r.review_text || r.comment || "N/A"}</p>
              <button style={styles.deleteBtn} onClick={() => handleDelete(r.id)}>
                Delete Review
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}

const styles = {
  page: { padding: "40px", backgroundColor: "#f4f6f8", minHeight: "100vh" },
  message: { color: "#333", marginBottom: "10px" },
  searchRow: { display: "flex", gap: "10px", marginBottom: "20px" },
  input: { padding: "10px", border: "1px solid #ccc", borderRadius: "6px", minWidth: "200px" },
  btn: { padding: "10px 16px", backgroundColor: "#1f6feb", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  card: { background: "#fff", padding: "20px", borderRadius: "8px", border: "1px solid #ddd", marginBottom: "12px" },
  deleteBtn: { marginTop: "10px", padding: "8px 12px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
};

export default AdminReviewsPage;