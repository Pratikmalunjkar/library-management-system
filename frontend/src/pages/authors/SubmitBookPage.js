import { useState } from "react";
import Navbar from "../../components/Navbar";
import apiClient from "../../api/apiClient";   // ✅ use apiClient directly

function SubmitBookPage() {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [pdfFile, setPdfFile] = useState(null);   // ✅ new state
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("genre", genre);
      formData.append("description", description);
      formData.append("pdf", pdfFile);   // ✅ attach file

      const res = await apiClient.post("/authors/submissions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(res.data.message || "Book submitted successfully");

      // reset form
      setTitle("");
      setGenre("");
      setDescription("");
      setPdfFile(null);

    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to submit book"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        <h2>Submit New Book</h2>

        <input
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          style={styles.input}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.textarea}
        />

        {/* ✅ file input */}
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files[0])}
          style={styles.input}
        />

        <button style={styles.button} onClick={handleSubmit}>
          Submit Book
        </button>

        {message && <p>{message}</p>}
      </div>
    </>
  );
}

const styles = {
  page: {
    padding: "40px",
    background: "#f4f6f8",
    minHeight: "100vh",
    maxWidth: "600px",
    margin: "auto",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    marginTop: "10px",
  },
  textarea: {
    display: "block",
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    height: "120px",
  },
  button: {
    marginTop: "20px",
    padding: "12px 18px",
    background: "#1f6feb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default SubmitBookPage;
