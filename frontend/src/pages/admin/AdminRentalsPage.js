import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getAllRentals, dispatchRental } from "../../api/adminApi";
import apiClient from "../../api/apiClient";

function AdminRentalsPage() {
  const [rentals, setRentals] = useState([]);

  const fetchRentals = async () => {
    try {
      const data = await getAllRentals();
      setRentals(data.rentals || []);
    } catch (error) {
      console.error("Failed to load rentals", error);
    }
  };

  const handleDispatch = async (id) => {
    try {
      await dispatchRental(id);
      alert("Rental dispatched successfully");
      fetchRentals();
    } catch (error) {
      alert("Dispatch failed");
    }
  };

  // ✅ New complete return handler
  const handleComplete = async (id) => {
    try {
      await apiClient.patch(`/rentals/${id}/complete`);
      alert("Return completed successfully");
      fetchRentals();
    } catch (error) {
      alert("Failed to complete return");
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "REQUESTED": return "#f59e0b";
      case "DISPATCHED": return "#1f6feb";
      case "RETURN_INITIATED": return "#dc3545";
      case "COMPLETED": return "#198754";
      default: return "#555";
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <h2>Rental Management</h2>

        {rentals.length === 0 ? (
          <p>No rentals found.</p>
        ) : (
          rentals.map((r) => (
            <div key={r.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3>{r.title}</h3>
                <span style={{
                  ...styles.badge,
                  backgroundColor: getStatusColor(r.status)
                }}>
                  {r.status}
                </span>
              </div>

              <p><strong>User:</strong> {r.email}</p>
              <p><strong>Due Date:</strong> {r.due_date
                ? new Date(r.due_date).toLocaleDateString()
                : "N/A"}
              </p>

              {/* ✅ Dispatch button for REQUESTED */}
              {r.status === "REQUESTED" && (
                <button
                  style={styles.dispatchBtn}
                  onClick={() => handleDispatch(r.id)}
                >
                  Dispatch Book
                </button>
              )}

              {/* ✅ Complete button for RETURN_INITIATED */}
              {r.status === "RETURN_INITIATED" && (
                <button
                  style={styles.completeBtn}
                  onClick={() => handleComplete(r.id)}
                >
                  Complete Return
                </button>
              )}

              {/* ✅ Completed status */}
              {r.status === "COMPLETED" && (
                <p style={styles.completedText}>✅ Return Completed</p>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}

const styles = {
  page: { padding: "40px", backgroundColor: "#f4f6f8", minHeight: "100vh" },
  card: {
    border: "1px solid #ddd",
    padding: "20px",
    marginBottom: "12px",
    borderRadius: "10px",
    backgroundColor: "#fff",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  badge: {
    padding: "4px 12px",
    borderRadius: "20px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "600",
  },
  dispatchBtn: {
    marginTop: "10px",
    padding: "8px 14px",
    backgroundColor: "#1f6feb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  completeBtn: {
    marginTop: "10px",
    padding: "8px 14px",
    backgroundColor: "#198754",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  completedText: {
    marginTop: "10px",
    color: "#198754",
    fontWeight: "600",
  },
};

export default AdminRentalsPage;