import { Link, useNavigate } from "react-router-dom";
import { getUserRole } from "../utils/getUserRole";

function Navbar() {
  const navigate = useNavigate();
  const role = getUserRole();   // ✅ decode JWT role

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
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
            {/* ✅ New Admin Rentals link */}
            <Link to="/admin/rentals" style={styles.link}>Admin Rentals</Link>
            <Link to="/admin/books" style={styles.link}>Manage Books</Link>
            <Link to="/admin/reviews" style={styles.link}>Moderate Reviews</Link>
            <Link to="/admin/users" style={styles.link}>Users</Link>
<Link to="/admin/authors-list" style={styles.link}>Authors</Link>
          </>
        )}
      </div>

      <button style={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 30px",
    backgroundColor: "#1f2937",
  },
  left: {
    display: "flex",
    gap: "20px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "600",
  },
  logoutButton: {
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#dc3545",
    color: "#fff",
    cursor: "pointer",
  },
};

export default Navbar;
