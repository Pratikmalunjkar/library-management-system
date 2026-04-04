import { useState } from "react";
import Navbar from "../../components/Navbar";
import apiClient from "../../api/apiClient";

function SubmitBookPage() {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");

  const [pdfFile, setPdfFile] = useState(null);

  // ✅ NEW STATE (cover image)
  const [coverFile, setCoverFile] = useState(null);

  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      if (!pdfFile) {
        setMessage("Please upload a PDF file");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("genre", genre);
      formData.append("description", description);
      formData.append("pdf", pdfFile);

      // ✅ ADD COVER FILE
      if (coverFile) {
        formData.append("cover", coverFile);
      }

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
      setCoverFile(null); // ✅ reset cover

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

        {/* ✅ PDF upload */}
        <label style={styles.label}>Upload PDF *</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files[0])}
          style={styles.input}
        />
        {pdfFile && (
          <p style={styles.fileSelected}>
            ✅ Selected: {pdfFile.name}
          </p>
        )}

        {/* ✅ NEW COVER IMAGE UPLOAD */}
        <label style={styles.label}>Cover Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCoverFile(e.target.files[0])}
          style={styles.input}
        />
        {coverFile && (
          <p style={styles.fileSelected}>
            ✅ Selected: {coverFile.name}
          </p>
        )}

        <button style={styles.button} onClick={handleSubmit}>
          Submit Book
        </button>

        {message && <p style={styles.message}>{message}</p>}
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
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  textarea: {
    display: "block",
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    height: "120px",
    borderRadius: "6px",
    border: "1px solid #ccc",
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
  label: {
    marginTop: "12px",
    fontWeight: "600",
    display: "block",
  },
  fileSelected: {
    color: "#198754",
    marginTop: "6px",
    fontSize: "14px",
  },
  message: {
    marginTop: "15px",
    fontWeight: "600",
  },
};

export default SubmitBookPage;