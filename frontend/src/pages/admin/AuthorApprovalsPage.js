import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getAuthorApplications, approveAuthor, rejectAuthor } from "../../api/adminApi";

function AuthorApprovalsPage() {
  const [authors, setAuthors] = useState([]);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [message, setMessage] = useState("");

  const fetchApplications = async () => {
    try {
      const data = await getAuthorApplications();
      setAuthors(data.authors || []);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveAuthor(id);
      setMessage("Author approved successfully");
      fetchApplications();
    } catch (err) {
      setMessage("Failed to approve author");
    }
  };

  const handleReject = async (id) => {
    if (!rejectReason.trim()) {
      setMessage("Please enter a rejection reason");
      return;
    }
    try {
      await rejectAuthor(id, rejectReason);
      setMessage("Author rejected successfully");
      setRejectingId(null);
      setRejectReason("");
      fetchApplications();
    } catch (err) {
      setMessage("Failed to reject author");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <h2>Author Applications</h2>

        {message && <p style={styles.message}>{message}</p>}

        {authors.length === 0 ? (
          <p>No pending applications</p>
        ) : (
          authors.map((a) => (
            <div key={a.id} style={styles.card}>
              <h3>{a.full_name}</h3>
              <p><strong>Biography:</strong> {a.biography}</p>
              <p><strong>Qualifications:</strong> {a.qualifications}</p>
              <p><strong>Experience:</strong> {a.experience}</p>

              <div style={styles.actions}>
                <button
                  style={styles.approve}
                  onClick={() => handleApprove(a.id)}
                >
                  Approve
                </button>

                <button
                  style={styles.reject}
                  onClick={() => setRejectingId(a.id)}
                >
                  Reject
                </button>
              </div>

              {/* ✅ Show rejection reason input */}
              {rejectingId === a.id && (
                <div style={styles.rejectBox}>
                  <textarea
                    placeholder="Enter rejection reason..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    style={styles.textarea}
                  />
                  <div style={styles.rejectActions}>
                    <button
                      style={styles.confirmReject}
                      onClick={() => handleReject(a.id)}
                    >
                      Confirm Reject
                    </button>
                    <button
                      style={styles.cancel}
                      onClick={() => {
                        setRejectingId(null);
                        setRejectReason("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}

const styles = {
  page: {
    padding: "40px",
    background: "#f4f6f8",
    minHeight: "100vh"
  },
  message: {
    color: "#333",
    fontWeight: "600",
    marginBottom: "12px"
  },
  card: {
    background: "#fff",
    padding: "20px",
    marginTop: "20px",
    borderRadius: "8px",
    border: "1px solid #ddd"
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "12px"
  },
  approve: {
    marginRight: "10px",
    padding: "8px 14px",
    background: "green",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  reject: {
    padding: "8px 14px",
    background: "red",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  rejectBox: {
    marginTop: "16px",
    padding: "16px",
    backgroundColor: "#fff5f5",
    borderRadius: "6px",
    border: "1px solid #dc3545"
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    minHeight: "80px",
    marginBottom: "10px"
  },
  rejectActions: {
    display: "flex",
    gap: "10px"
  },
  confirmReject: {
    padding: "8px 14px",
    background: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  cancel: {
    padding: "8px 14px",
    background: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default AuthorApprovalsPage;