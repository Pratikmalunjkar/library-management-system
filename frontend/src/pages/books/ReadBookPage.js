import { useParams, useNavigate } from "react-router-dom";

function ReadBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const pdfUrl = `http://localhost:5000/api/books/read/${id}`;

  return (
    <div style={styles.page}>
      <button style={styles.backButton} onClick={() => navigate(`/books/${id}`)}>
        ← Back to Details
      </button>

      <div style={styles.card}>
        <h2>Read Book</h2>

        {token ? (
          <iframe
            title="Book PDF Reader"
            src={`${pdfUrl}`}
            style={styles.iframe}
          />
        ) : (
          <p>Please login again to access this book.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f4f6f8",
    padding: "30px",
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
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  iframe: {
    width: "100%",
    height: "80vh",
    border: "none",
    marginTop: "20px",
  },
};

export default ReadBookPage;