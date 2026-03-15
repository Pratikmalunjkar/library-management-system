import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import apiClient from "../../api/apiClient";

function ApplyAuthorPage() {
  const [biography, setBiography] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [experience, setExperience] = useState("");
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");
  const [existingApplication, setExistingApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Check if application already exists
  const checkExistingApplication = async () => {
    try {
      const res = await apiClient.get("/authors/me/status");
      setExistingApplication(res.data.author);
    } catch (err) {
      // No application exists yet
      setExistingApplication(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkExistingApplication();
  }, []);

  const handleApply = async () => {
    try {
      const formData = new FormData();
      formData.append("biography", biography);
      formData.append("qualifications", qualifications);
      formData.append("experience", experience);
      if (photo) {
        formData.append("photo", photo);
      }

      const res = await apiClient.post("/authors/apply", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data.message || "Application submitted");
      checkExistingApplication(); // ✅ refresh status after apply
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to apply");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <p style={{ padding: "40px" }}>Loading...</p>
      </>
    );
  }

  // ✅ Show status if application already exists
  if (existingApplication) {
    return (
      <>
        <Navbar />
        <div style={styles.page}>
          <h2>Author Application Status</h2>

          <div style={{
            ...styles.statusBox,
            borderColor:
              existingApplication.approval_status === "APPROVED" ? "#198754" :
              existingApplication.approval_status === "REJECTED" ? "#dc3545" : "#f59e0b"
          }}>
            <p style={styles.statusLabel}>Current Status:</p>
            <p style={{
              ...styles.statusBadge,
              backgroundColor:
                existingApplication.approval_status === "APPROVED" ? "#198754" :
                existingApplication.approval_status === "REJECTED" ? "#dc3545" : "#f59e0b"
            }}>
              {existingApplication.approval_status}
            </p>

            <div style={styles.detailRow}>
              <strong>Biography:</strong>
              <p>{existingApplication.biography || "N/A"}</p>
            </div>

            <div style={styles.detailRow}>
              <strong>Qualifications:</strong>
              <p>{existingApplication.qualifications || "N/A"}</p>
            </div>

            <div style={styles.detailRow}>
              <strong>Experience:</strong>
              <p>{existingApplication.experience || "N/A"}</p>
            </div>

            {existingApplication.approval_status === "REJECTED" && (
              <div style={styles.rejectionBox}>
                <strong>Rejection Reason:</strong>
                <p>{existingApplication.rejection_reason || "No reason provided"}</p>
              </div>
            )}

            {existingApplication.approval_status === "PENDING" && (
              <p style={styles.pendingNote}>
                ⏳ Your application is under review. Please wait for admin approval.
              </p>
            )}
{existingApplication.approval_status === "APPROVED" && (
  <div>
    <p style={styles.approvedNote}>
      🎉 Congratulations! You are now an Author.
    </p>
    <button
      style={styles.reloginBtn}
      onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      }}
    >
      Click here to Login again as Author
    </button>
  </div>
)}
          </div>
        </div>
      </>
    );
  }

  // ✅ Show form if no application exists
  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <h2>Become an Author</h2>
        <p>Fill in your details to apply as an author.</p>

        <textarea
          placeholder="Biography"
          value={biography}
          onChange={(e) => setBiography(e.target.value)}
          style={styles.textarea}
        />

        <input
          placeholder="Qualifications"
          value={qualifications}
          onChange={(e) => setQualifications(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>Profile Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          style={styles.input}
        />

        <button style={styles.button} onClick={handleApply}>
          Apply for Author
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </>
  );
}

const styles = {
  page: {
    padding: "40px",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
    maxWidth: "600px",
    margin: "auto",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  textarea: {
    display: "block",
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    height: "120px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  label: {
    display: "block",
    marginTop: "14px",
    fontWeight: "600",
  },
  button: {
    marginTop: "20px",
    padding: "12px 18px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#1f6feb",
    color: "#fff",
    cursor: "pointer",
  },
  message: { marginTop: "20px" },
  statusBox: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    border: "3px solid",
    marginTop: "20px",
  },
  statusLabel: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  statusBadge: {
    display: "inline-block",
    padding: "6px 16px",
    borderRadius: "20px",
    color: "#fff",
    fontWeight: "600",
    fontSize: "14px",
    marginBottom: "20px",
  },
  detailRow: {
    marginTop: "12px",
  },
  rejectionBox: {
    marginTop: "16px",
    padding: "12px",
    backgroundColor: "#fff5f5",
    borderRadius: "6px",
    border: "1px solid #dc3545",
  },
  pendingNote: {
    marginTop: "16px",
    color: "#f59e0b",
    fontWeight: "600",
  },
  approvedNote: {
    marginTop: "16px",
    color: "#198754",
    fontWeight: "600",
  },
  reloginBtn: {
  marginTop: "16px",
  padding: "10px 18px",
  backgroundColor: "#1f6feb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
},
};

export default ApplyAuthorPage;