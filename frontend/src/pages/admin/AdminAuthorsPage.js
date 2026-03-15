import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import apiClient from "../../api/apiClient";

function AdminAuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [message, setMessage] = useState("");

  const fetchAuthors = async () => {
    try {
      const res = await apiClient.get("/authors");
      setAuthors(res.data.authors || []);
    } catch (err) {
      setMessage("Failed to fetch authors");
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <h2>All Authors</h2>
        {message && <p>{message}</p>}

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Biography</th>
              <th style={styles.th}>Experience</th>
              <th style={styles.th}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {authors.map((a) => (
              <tr key={a.id}>
                <td style={styles.td}>{a.id}</td>
                <td style={styles.td}>{a.full_name}</td>
                <td style={styles.td}>{a.email || "N/A"}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor:
                      a.approval_status === "APPROVED" ? "#198754" :
                      a.approval_status === "REJECTED" ? "#dc3545" : "#f59e0b"
                  }}>
                    {a.approval_status}
                  </span>
                </td>
                <td style={styles.td}>{a.biography || "N/A"}</td>
                <td style={styles.td}>{a.experience || "N/A"}</td>
                <td style={styles.td}>
                  {new Date(a.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const styles = {
  page: { padding: "40px", backgroundColor: "#f4f6f8", minHeight: "100vh" },
  table: { width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", borderRadius: "8px", overflow: "hidden" },
  th: { padding: "12px 16px", backgroundColor: "#1f2937", color: "#fff", textAlign: "left" },
  td: { padding: "12px 16px", borderBottom: "1px solid #eee" },
  badge: { padding: "4px 10px", borderRadius: "20px", color: "#fff", fontSize: "12px", fontWeight: "600" },
};

export default AdminAuthorsPage;