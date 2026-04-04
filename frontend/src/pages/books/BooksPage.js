import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllBooks,
  searchBooks,
  filterBooksByGenre,
  filterBooksByRating,
} from "../../api/bookApi";

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [genre, setGenre] = useState("");
  const [minRating, setMinRating] = useState("");
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await getAllBooks();
      setBooks(data.books || []);
    } catch (err) {
      console.error("Failed to fetch books", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await searchBooks(searchText);
      setBooks(data.books || []);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreFilter = async () => {
    try {
      setLoading(true);

      if (!genre.trim()) {
        await fetchBooks();
        return;
      }

      const data = await filterBooksByGenre(genre);
      setBooks(data.books || []);
    } catch (err) {
      console.error("Genre filter failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingFilter = async () => {
    try {
      setLoading(true);

      if (!minRating.trim()) {
        await fetchBooks();
        return;
      }

      const data = await filterBooksByRating(minRating);
      setBooks(data.books || []);
    } catch (err) {
      console.error("Rating filter failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <h2>Books Catalog</h2>

        {/* Controls */}
        <div style={styles.controls}>
          <input
            type="text"
            placeholder="Search by title, author, genre"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleSearch} style={styles.button}>
            Search
          </button>

          <input
            type="text"
            placeholder="Filter by genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleGenreFilter} style={styles.button}>
            Genre Filter
          </button>

          <input
            type="number"
            placeholder="Min rating"
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleRatingFilter} style={styles.button}>
            Rating Filter
          </button>

          <button onClick={fetchBooks} style={styles.resetButton}>
            Reset
          </button>
        </div>

        {/* Books Grid */}
        {loading ? (
          <p>Loading books...</p>
        ) : (
          <div style={styles.grid}>
            {books.map((book) => (
              <div
                key={book.id}
                style={styles.card}
                onClick={() => navigate(`/books/${book.id}`)}
              >
                {/* ✅ Cover image */}
                {book.cover_image_url ? (
                  <img
                    src={`http://localhost:5000/${book.cover_image_url}`}
                    alt={book.title}
                    style={styles.coverImage}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <div style={styles.noCover}>
                    <span>No Cover</span>
                  </div>
                )}

                <h3>{book.title}</h3>
                <p>Genre: {book.genre}</p>
                <p>Rating: {book.avg_rating || "N/A"}</p>
                <p style={styles.viewText}>Click to view details</p>
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
    padding: "40px",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
  },
  controls: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    minWidth: "180px",
  },
  button: {
    padding: "10px 14px",
    backgroundColor: "#1f6feb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  resetButton: {
    padding: "10px 14px",
    backgroundColor: "#555",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
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
    cursor: "pointer",
  },
  coverImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "6px",
    marginBottom: "10px",
  },
  noCover: {
    width: "100%",
    height: "200px",
    backgroundColor: "#e5e7eb",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "10px",
    color: "#9ca3af",
    fontSize: "14px",
  },
  viewText: {
    marginTop: "10px",
    color: "#1f6feb",
    fontSize: "14px",
  },
};

export default BooksPage;