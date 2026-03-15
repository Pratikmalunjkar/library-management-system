import { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist } from "../../api/wishlistApi";
import Navbar from "../../components/Navbar";   // ✅ Navbar import

function WishlistPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await getWishlist();
      setBooks(data.books || []);
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
      setMessage("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (bookId) => {
    try {
      const data = await removeFromWishlist(bookId);
      setMessage(data.message || "Removed from wishlist");
      fetchWishlist();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to remove book");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <>
      <Navbar />   {/* ✅ Navbar at top */}
      <div style={styles.page}>
        <h2>My Wishlist</h2>

        {message && <p style={styles.message}>{message}</p>}

        {loading ? (
          <p>Loading wishlist...</p>
        ) : books.length === 0 ? (
          <p>No books in wishlist.</p>
        ) : (
          <div style={styles.grid}>
            {books.map((book) => (
              <div key={book.id} style={styles.card}>
                <h3>{book.title}</h3>
                <p>Genre: {book.genre}</p>
                <p>Rating: {book.avg_rating || "N/A"}</p>

                <button
                  style={styles.removeButton}
                  onClick={() => handleRemove(book.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
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
  message: {
    margin: "10px 0 20px",
    color: "#333",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  removeButton: {
    marginTop: "12px",
    padding: "10px 14px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#dc3545",
    color: "#fff",
    cursor: "pointer",
  },
};

export default WishlistPage;
