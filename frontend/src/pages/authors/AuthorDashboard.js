import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import apiClient from "../../api/apiClient";
import { Link } from "react-router-dom";

function AuthorDashboard() {
  const [metrics, setMetrics] = useState(null);

  const fetchMetrics = async () => {
    try {
      const res = await apiClient.get("/authors/metrics/me");
      setMetrics(res.data.metrics);
    } catch (error) {
      console.error("Failed to load author metrics", error);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (!metrics) {
    return (
      <>
        <Navbar />
        <p style={{ padding: "40px" }}>Loading author dashboard...</p>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <h2>Author Dashboard</h2>

        <div style={styles.grid}>
          <div style={styles.card}>
            <h3>Total Books</h3>
            <p style={styles.number}>{metrics.total_books}</p>
          </div>

          <div style={styles.card}>
            <h3>Total Reads</h3>
            <p style={styles.number}>{metrics.total_reads}</p>
          </div>

          <div style={styles.card}>
            <h3>Total Rentals</h3>
            <p style={styles.number}>{metrics.total_rentals}</p>
          </div>

          <div style={styles.card}>
            <h3>Avg Rating</h3>
            <p style={styles.number}>{metrics.avg_rating} ⭐</p>
          </div>

          <div style={styles.card}>
            <h3>Total Reviews</h3>
            <p style={styles.number}>{metrics.total_reviews}</p>
          </div>

          <div style={styles.card}>
            <h3>Pending Submissions</h3>
            <p style={styles.number}>{metrics.pending_submissions}</p>
          </div>

          <div style={styles.card}>
            <h3>Approved Books</h3>
            <p style={styles.number}>{metrics.approved_books}</p>
          </div>
        </div>

        <Link to="/author/submit-book">
          <button style={styles.button}>Submit New Book</button>
        </Link>
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fff",
    textAlign: "center",
  },
  number: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#1f6feb",
  },
  button: {
    marginTop: "30px",
    padding: "12px 18px",
    background: "#1f6feb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default AuthorDashboard;