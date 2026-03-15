import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import apiClient from "../../api/apiClient";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get("/users");
      setUsers(res.data.users || []);
    } catch (err) {
      setMessage("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <h2>All Users</h2>
        {message && <p>{message}</p>}

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Active</th>
              <th style={styles.th}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={styles.td}>{u.id}</td>
                <td style={styles.td}>{u.full_name}</td>
                <td style={styles.td}>{u.email || "N/A"}</td>
                <td style={styles.td}>{u.phone || "N/A"}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor:
                      u.user_role === "ADMIN" ? "#dc3545" :
                      u.user_role === "AUTHOR" ? "#1f6feb" : "#198754"
                  }}>
                    {u.user_role}
                  </span>
                </td>
                <td style={styles.td}>{u.is_active ? "✅" : "❌"}</td>
                <td style={styles.td}>
                  {new Date(u.created_at).toLocaleDateString()}
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

export default AdminUsersPage;