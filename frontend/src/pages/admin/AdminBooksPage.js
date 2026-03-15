import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getAllBooks, updateBook, deleteBook } from "../../api/bookApi";
import apiClient from "../../api/apiClient";

function AdminBooksPage() {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [form, setForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "", genre: "", description: "",
    isbn: "", author_name: "",
    total_copies: 1, available_copies: 1
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [message, setMessage] = useState("");

  const fetchBooks = async () => {
    const data = await getAllBooks();
    setBooks(data.books || []);
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleEdit = (book) => {
    setEditingBook(book.id);
    setForm({ ...book });
  };

  const handleUpdate = async () => {
    try {
      await updateBook(editingBook, form);
      setMessage("Book updated successfully");
      setEditingBook(null);
      fetchBooks();
    } catch (err) {
      setMessage("Failed to update book");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await deleteBook(id);
      setMessage("Book deleted successfully");
      fetchBooks();
    } catch (err) {
      setMessage("Failed to delete book");
    }
  };

  const handleAddBook = async () => {
    try {
      if (!pdfFile) {
        setMessage("Please upload a PDF file");
        return;
      }

      // ✅ Use FormData to upload PDF + book data together
      const formData = new FormData();
      formData.append("title", newBook.title);
      formData.append("genre", newBook.genre);
      formData.append("description", newBook.description);
      formData.append("isbn", newBook.isbn);
      formData.append("author_name", newBook.author_name);
      formData.append("total_copies", newBook.total_copies);
      formData.append("available_copies", newBook.available_copies);
      formData.append("pdf", pdfFile);

      await apiClient.post("/books/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setMessage("Book added successfully");
      setShowAddForm(false);
      setNewBook({
        title: "", genre: "", description: "",
        isbn: "", author_name: "",
        total_copies: 1, available_copies: 1
      });
      setPdfFile(null);
      fetchBooks();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add book");
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <h2>Manage Books</h2>
        {message && <p style={styles.message}>{message}</p>}

        <button style={styles.addBtn} onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancel" : "+ Add New Book"}
        </button>

        {showAddForm && (
          <div style={styles.formBox}>
            <h3>Add New Book</h3>

            <input
              placeholder="Title *"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              style={styles.input}
            />
            <input
              placeholder="Genre *"
              value={newBook.genre}
              onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
              style={styles.input}
            />
            <textarea
              placeholder="Description"
              value={newBook.description}
              onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
              style={styles.textarea}
            />
            <input
              placeholder="ISBN"
              value={newBook.isbn}
              onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
              style={styles.input}
            />
            <input
              placeholder="Author Name"
              value={newBook.author_name}
              onChange={(e) => setNewBook({ ...newBook, author_name: e.target.value })}
              style={styles.input}
            />
            <input
              type="number"
              placeholder="Total Copies"
              value={newBook.total_copies}
              onChange={(e) => setNewBook({ ...newBook, total_copies: e.target.value })}
              style={styles.input}
            />
            <input
              type="number"
              placeholder="Available Copies"
              value={newBook.available_copies}
              onChange={(e) => setNewBook({ ...newBook, available_copies: e.target.value })}
              style={styles.input}
            />

            {/* ✅ PDF Upload */}
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

            <button style={styles.saveBtn} onClick={handleAddBook}>
              Add Book
            </button>
          </div>
        )}

        <div style={styles.grid}>
          {books.map((book) => (
            <div key={book.id} style={styles.card}>
              {editingBook === book.id ? (
                <>
                  {["title", "genre", "description", "isbn", "author_name"].map(field => (
                    <input
                      key={field}
                      placeholder={field}
                      value={form[field] || ""}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      style={styles.input}
                    />
                  ))}
                  <input
                    type="number"
                    placeholder="Total Copies"
                    value={form.total_copies || ""}
                    onChange={(e) => setForm({ ...form, total_copies: e.target.value })}
                    style={styles.input}
                  />
                  <input
                    type="number"
                    placeholder="Available Copies"
                    value={form.available_copies || ""}
                    onChange={(e) => setForm({ ...form, available_copies: e.target.value })}
                    style={styles.input}
                  />
                  <button style={styles.saveBtn} onClick={handleUpdate}>Save</button>
                  <button style={styles.cancelBtn} onClick={() => setEditingBook(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <h3>{book.title}</h3>
                  <p>Genre: {book.genre}</p>
                  <p>Author: {book.author_name || "N/A"}</p>
                  <p>Copies: {book.available_copies}/{book.total_copies}</p>
                  <p>Rating: {book.avg_rating || "N/A"}</p>
                  <button style={styles.editBtn} onClick={() => handleEdit(book)}>Edit</button>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(book.id)}>Delete</button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const styles = {
  page: { padding: "40px", backgroundColor: "#f4f6f8", minHeight: "100vh" },
  message: { color: "#333", marginBottom: "10px", fontWeight: "600" },
  addBtn: { padding: "10px 18px", backgroundColor: "#1f6feb", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", marginBottom: "20px" },
  formBox: { background: "#fff", padding: "20px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #ddd" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: "20px" },
  card: { padding: "20px", border: "1px solid #ddd", borderRadius: "10px", backgroundColor: "#fff" },
  input: { display: "block", width: "100%", padding: "8px", marginTop: "8px", border: "1px solid #ccc", borderRadius: "4px" },
  textarea: { display: "block", width: "100%", padding: "8px", marginTop: "8px", border: "1px solid #ccc", borderRadius: "4px", minHeight: "80px" },
  label: { display: "block", marginTop: "12px", fontWeight: "600" },
  fileSelected: { color: "#198754", marginTop: "6px", fontSize: "14px" },
  editBtn: { marginTop: "10px", marginRight: "8px", padding: "8px 12px", backgroundColor: "#1f6feb", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  deleteBtn: { marginTop: "10px", padding: "8px 12px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  saveBtn: { marginTop: "10px", marginRight: "8px", padding: "8px 12px", backgroundColor: "#198754", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  cancelBtn: { marginTop: "10px", padding: "8px 12px", backgroundColor: "#6c757d", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
};

export default AdminBooksPage;