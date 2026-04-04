import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserRole } from "../utils/getUserRole";
import apiClient from "../api/apiClient";

function Navbar() {
  const navigate = useNavigate();
  const role = getUserRole();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await apiClient.get("/users/me");
        setUserInfo(res.data.user);
      } catch (err) {
        console.error("Failed to fetch user info");
      }
    };
    if (role) fetchUserInfo();
  }, [role]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "ADMIN": return "#dc3545";
      case "AUTHOR": return "#1f6feb";
      case "USER": return "#198754";
      default: return "#555";
    }
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        {role === "USER" && (
          <>
            <Link to="/books" style={styles.link}>Books</Link>
            <Link to="/wishlist" style={styles.link}>Wishlist</Link>
            <Link to="/rentals" style={styles.link}>Rentals</Link>
            <Link to="/apply-author" style={styles.link}>Become Author</Link>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
          </>
        )}

        {role === "AUTHOR" && (
          <>
            <Link to="/books" style={styles.link}>Books</Link>
            <Link to="/author" style={styles.link}>Author Dashboard</Link>
          </>
        )}

        {role === "ADMIN" && (
          <>
            <Link to="/admin" style={styles.link}>Admin Dashboard</Link>
            <Link to="/admin/authors" style={styles.link}>Author Approvals</Link>
            <Link to="/admin/submissions" style={styles.link}>Submissions</Link>
            <Link to="/admin/rentals" style={styles.link}>Admin Rentals</Link>
            <Link to="/admin/books" style={styles.link}>Manage Books</Link>
            <Link to="/admin/reviews" style={styles.link}>Moderate Reviews</Link>
            <Link to="/admin/users" style={styles.link}>Users</Link>
            <Link to="/admin/authors-list" style={styles.link}>Authors</Link>
          </>
        )}
      </div>

      {/* ✅ Right side - user info + logout */}
      <div style={styles.right}>
        {userInfo && (
          <div style={styles.userInfo}>
            <div style={styles.userDetails}>
              <span style={styles.userName}>{userInfo.full_name || "User"}</span>
              <span style={styles.userEmail}>{userInfo.email || ""}</span>
            </div>
            <span style={{
              ...styles.roleBadge,
              backgroundColor: getRoleBadgeColor(role)
            }}>
              {role}
            </span>
          </div>
        )}

        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 30px",
    backgroundColor: "#1f2937",
     position: "sticky",   
    top: 0,               
    zIndex: 1000,  
  },
  left: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  userDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    alignItems: "flex-end",
  },
  userName: {
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "600",
  },
  userEmail: {
    color: "#9ca3af",
    fontSize: "11px",
  },
  roleBadge: {
    padding: "3px 10px",
    borderRadius: "20px",
    color: "#fff",
    fontSize: "11px",
    fontWeight: "600",
  },
  logoutButton: {
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#dc3545",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default Navbar;