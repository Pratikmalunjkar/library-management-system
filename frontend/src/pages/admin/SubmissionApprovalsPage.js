import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  getPendingSubmissions,
  approveSubmission,
  rejectSubmission
} from "../../api/adminSubmissionApi";

function SubmissionApprovalsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectComment, setRejectComment] = useState("");
  const [message, setMessage] = useState("");

  const fetchSubmissions = async () => {
    try {
      const data = await getPendingSubmissions();
      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error("Failed to fetch submissions", error);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveSubmission(id);
      setMessage("Submission approved successfully");
      fetchSubmissions();
    } catch (err) {
      setMessage("Failed to approve submission");
    }
  };

  const handleReject = async (id) => {
    if (!rejectComment.trim()) {
      setMessage("Please enter a rejection reason");
      return;
    }
    try {
      await rejectSubmission(id, rejectComment);
      setMessage("Submission rejected successfully");
      setRejectingId(null);
      setRejectComment("");
      fetchSubmissions();
    } catch (err) {
      setMessage("Failed to reject submission");
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <h2>Pending Book Submissions</h2>

        {message && <p style={styles.message}>{message}</p>}

        {submissions.length === 0 && <p>No pending submissions.</p>}

        {submissions.map((s) => (
          <div key={s.id} style={styles.card}>
            <h3>{s.title}</h3>
            <p><strong>Genre:</strong> {s.genre}</p>
            <p><strong>Author:</strong> {s.full_name}</p>
            <p><strong>Description:</strong> {s.description || "N/A"}</p>

            <div style={styles.actions}>
              <button
                style={styles.approve}
                onClick={() => handleApprove(s.id)}
              >
                Approve
              </button>

              <button
                style={styles.reject}
                onClick={() => setRejectingId(s.id)}
              >
                Reject
              </button>
            </div>

            {/* ✅ Show rejection reason input when reject is clicked */}
            {rejectingId === s.id && (
              <div style={styles.rejectBox}>
                <textarea
                  placeholder="Enter rejection reason..."
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                  style={styles.textarea}
                />
                <div style={styles.rejectActions}>
                  <button
                    style={styles.confirmReject}
                    onClick={() => handleReject(s.id)}
                  >
                    Confirm Reject
                  </button>
                  <button
                    style={styles.cancel}
                    onClick={() => {
                      setRejectingId(null);
                      setRejectComment("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
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
    marginBottom: "12px",
    fontWeight: "600"
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

export default SubmissionApprovalsPage;