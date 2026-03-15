import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getMyRentals, initiateReturn } from "../../api/rentalApi";

function RentalsPage() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRentals = async () => {
    try {
      const data = await getMyRentals();
      setRentals(data.rentals || []);
    } catch (error) {
      console.error("Failed to load rentals", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Return handler
  const handleReturn = async (rentalId) => {
    try {
      const data = await initiateReturn(rentalId);
      alert(data.message || "Return initiated");
      fetchRentals(); // refresh rentals
    } catch (error) {
      alert(error.response?.data?.message || "Return failed");
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        <h2>My Rentals</h2>

        {loading ? (
          <p>Loading rentals...</p>
        ) : rentals.length === 0 ? (
          <p>No rentals found.</p>
        ) : (
          <div style={styles.grid}>
            {rentals.map((rental) => (
              <div key={rental.id} style={styles.card}>
                <h3>{rental.title}</h3>

                <p>Status: {rental.status}</p>

                <p>
                  Due Date:{" "}
                  {rental.due_date
                    ? new Date(rental.due_date).toLocaleDateString()
                    : "N/A"}
                </p>

                {/* ✅ Show Return button only when status = DISPATCHED */}
                {rental.status === "DISPATCHED" && (
                  <button
                    style={styles.returnButton}
                    onClick={() => handleReturn(rental.id)}
                  >
                    Return Book
                  </button>
                )}
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fff",
  },
  // ✅ Return button style
  returnButton: {
    marginTop: "10px",
    padding: "8px 12px",
    backgroundColor: "#e63946",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default RentalsPage;
