import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestOtp } from "../../api/authApi";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Email is required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const data = await requestOtp({
        email,
        full_name: fullName,
      });

      setMessage(data.message || "OTP sent successfully");

      navigate("/verify-otp", {
        state: { email },
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Login / Register</h2>
        <p style={styles.subText}>Enter your email to receive OTP</p>

        <form onSubmit={handleRequestOtp} style={styles.form}>
          <input
            type="text"
            placeholder="Full Name (optional)"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={styles.input}
          />

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Sending OTP..." : "Request OTP"}
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6f8",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
  },
  heading: {
    marginBottom: "10px",
    textAlign: "center",
  },
  subText: {
    marginBottom: "20px",
    textAlign: "center",
    color: "#555",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    outline: "none",
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#1f6feb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  message: {
    marginTop: "15px",
    textAlign: "center",
    color: "#333",
  },
};

export default LoginPage;