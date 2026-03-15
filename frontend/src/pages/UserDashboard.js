import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import apiClient from "../api/apiClient";

function UserDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [message, setMessage] = useState("");

  const fetchDashboard = async () => {
    try {
      const res = await apiClient.get("/users/dashboard");
      setDashboard(res.data);
    } catch (err) {
      setMessage("Failed to load dashboard");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!dashboard) {
    return (
      <>
        <Navbar />
        <p style={{ padding: "40px" }}>
          {message || "Loading dashboard..."}
        </p>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <h2>My Dashboard</h2>

        {/* Summary Card */}
        <div style={styles.summaryRow}>
          <div style={styles.summaryCard}>
            <h3>Books Read</h3>
            <p style={styles.bigNumber}>{dashboard.books_read}</p>
          </div>
          <div style={styles.summaryCard}>
            <h3>Active Rentals</h3>
            <p style={styles.bigNumber}>{dashboard.active_rentals.length}</p>
          </div>
          <div style={styles.summaryCard}>
            <h3>Completed Rentals</h3>
            <p style={styles.bigNumber}>{dashboard.rental_history.length}</p>
          </div>
          <div style={styles.summaryCard}>
            <h3>Wishlist</h3>
            <p style={styles.bigNumber}>{dashboard.wishlist.length}</p>
          </div>
          <div style={styles.summaryCard}>
            <h3>Reviews</h3>
            <p style={styles.bigNumber}>{dashboard.reviews.length}</p>
          </div>
        </div>

        {/* Active Rentals */}
        <h3 style={styles.sectionTitle}>Active Rentals</h3>
        {dashboard.active_rentals.length === 0 ? (
          <p>No active rentals.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Book</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.active_rentals.map((r) => (
                <tr key={r.id}>
                  <td style={styles.td}>{r.title}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor:
                        r.status === "DISPATCHED" ? "#1f6feb" :
                        r.status === "RETURN_INITIATED" ? "#f59e0b" : "#198754"
                    }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {r.due_date
                      ? new Date(r.due_date).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Rental History */}
        <h3 style={styles.sectionTitle}>Rental History</h3>
        {dashboard.rental_history.length === 0 ? (
          <p>No rental history.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Book</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Returned On</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.rental_history.map((r) => (
                <tr key={r.id}>
                  <td style={styles.td}>{r.title}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, backgroundColor: "#198754" }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {r.returned_at
                      ? new Date(r.returned_at).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Wishlist */}
        <h3 style={styles.sectionTitle}>My Wishlist</h3>
        {dashboard.wishlist.length === 0 ? (
          <p>No books in wishlist.</p>
        ) : (
          <div style={styles.grid}>
            {dashboard.wishlist.map((b) => (
              <div key={b.id} style={styles.card}>
                <h4>{b.title}</h4>
                <p>Genre: {b.genre}</p>
                <p>Rating: {b.avg_rating || "N/A"}</p>
              </div>
            ))}
          </div>
        )}

        {/* Reviews */}
        <h3 style={styles.sectionTitle}>My Reviews</h3>
        {dashboard.reviews.length === 0 ? (
          <p>No reviews submitted.</p>
        ) : (
          <div style={styles.grid}>
            {dashboard.reviews.map((r) => (
              <div key={r.id} style={styles.card}>
                <h4>{r.title}</h4>
                <p>Rating: {r.rating} / 5</p>
                <p>{r.review_text || "No comment"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  page: { padding: "40px", backgroundColor: "#f4f6f8", minHeight: "100vh" },
  summaryRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))",
    gap: "16px",
    marginBottom: "30px",
  },
  summaryCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    textAlign: "center",
  },
  bigNumber: { fontSize: "32px", fontWeight: "bold", color: "#1f6feb" },
  sectionTitle: { marginTop: "30px", marginBottom: "12px" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
  },
  th: {
    padding: "12px 16px",
    backgroundColor: "#1f2937",
    color: "#fff",
    textAlign: "left",
  },
  td: { padding: "12px 16px", borderBottom: "1px solid #eee" },
  badge: {
    padding: "4px 10px",
    borderRadius: "20px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "600",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))",
    gap: "16px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "16px",
    borderRadius: "10px",
    border: "1px solid #ddd",
  },
};

export default UserDashboard;