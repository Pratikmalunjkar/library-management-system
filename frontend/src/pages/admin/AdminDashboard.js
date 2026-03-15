import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import apiClient from "../../api/apiClient";

function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [booksAnalytics, setBooksAnalytics] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const overviewRes = await apiClient.get("/admin/analytics/overview");
      const booksRes = await apiClient.get("/admin/analytics/books");

      // ✅ Handle both cases: with or without "analytics" key
      setOverview(overviewRes.data.analytics || overviewRes.data);
      setBooksAnalytics(booksRes.data.analytics || booksRes.data);

      // Debug logs
      console.log("Overview Response:", overviewRes.data);
      console.log("Books Response:", booksRes.data);
    } catch (error) {
      console.error("Failed to fetch analytics", error);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (!overview) {
    return (
      <>
        <Navbar />
        <p style={{ padding: "40px" }}>Loading analytics...</p>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        <h2>Admin Dashboard</h2>

        <div style={styles.grid}>
          <div style={styles.card}>
            <h3>Total Users</h3>
            <p>{overview.total_users}</p>
          </div>

          <div style={styles.card}>
            <h3>Total Authors</h3>
            <p>{overview.total_authors}</p>
          </div>

          <div style={styles.card}>
            <h3>Total Books</h3>
            <p>{overview.total_books}</p>
          </div>

          <div style={styles.card}>
            <h3>Active Rentals</h3>
            <p>{overview.active_rentals}</p>
          </div>

          <div style={styles.card}>
            <h3>Overdue Rentals</h3>
            <p>{overview.overdue_rentals}</p>
          </div>
        </div>

        {booksAnalytics && booksAnalytics.most_read && (
          <>
            <h3 style={{ marginTop: "40px" }}>Top Books</h3>

            <div style={styles.grid}>
              {booksAnalytics.most_read.map((book) => (
                <div key={book.id} style={styles.card}>
                  <h4>{book.title}</h4>
                  <p>Reads: {book.read_count}</p>
                </div>
              ))}
            </div>
          </>
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fff",
  },
};

export default AdminDashboard;
