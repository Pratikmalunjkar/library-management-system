const path = require("path");
const fs = require("fs");

const bookService = require("./book.service");
const db = require("../../config/db"); // ✅ added import

const addBook = async (req, res) => {
  try {
    const book = await bookService.addBook(req.body);
    res.status(201).json({
      message: "Book added successfully",
      book
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const listBooks = async (req, res) => {
  try {
    const books = await bookService.listBooks();
    res.status(200).json({ books });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    res.status(200).json({ book });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const searchBooks = async (req, res) => {
  try {
    const books = await bookService.searchBooks(req.query.q || "");
    res.status(200).json({ books });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const filterBooksByGenre = async (req, res) => {
  try {
    const genre = req.query.genre;
    const books = await bookService.filterBooksByGenre(genre);
    res.status(200).json({ books });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const filterBooksByRating = async (req, res) => {
  try {
    const minRating = Number(req.query.min || 0);
    const books = await bookService.filterBooksByRating(minRating);
    res.status(200).json({ books });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const filterBooksByPopularity = async (req, res) => {
  try {
    const books = await bookService.filterBooksByPopularity();
    res.status(200).json({ books });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const readBookPdf = async (req, res) => {
  try {
    const pdfKey = await bookService.getBookPdfKey(req.params.id);

    if (!pdfKey) {
      return res.status(404).send(`
        <html>
          <body style="font-family: sans-serif; text-align: center; padding: 60px;">
            <h2>📚 PDF Not Available</h2>
            <p>This book does not have a digital copy available yet.</p>
            <a href="javascript:history.back()" 
               style="display:inline-block; margin-top:20px; padding:10px 20px;
               background:#1f6feb; color:#fff; border-radius:6px; text-decoration:none;">
              ← Go Back
            </a>
          </body>
        </html>
      `);
    }

    const fileName = path.basename(pdfKey);
    const filePath = path.join(process.cwd(), "storage/books/", fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send(`
        <html>
          <body style="font-family: sans-serif; text-align: center; padding: 60px;">
            <h2>📚 PDF Not Available</h2>
            <p>This book does not have a digital copy available yet.</p>
            <a href="javascript:history.back()" 
               style="display:inline-block; margin-top:20px; padding:10px 20px;
               background:#1f6feb; color:#fff; border-radius:6px; text-decoration:none;">
              ← Go Back
            </a>
          </body>
        </html>
      `);
    }

    // ✅ Increment read count
    await db.query(
      `UPDATE books 
       SET read_count = read_count + 1, updated_at = NOW() 
       WHERE id = $1`,
      [req.params.id]
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

  } catch (err) {
    res.status(404).send(`
      <html>
        <body style="font-family: sans-serif; text-align: center; padding: 60px;">
          <h2>📚 PDF Not Available</h2>
          <p>This book does not have a digital copy available yet.</p>
          <a href="javascript:history.back()" 
             style="display:inline-block; margin-top:20px; padding:10px 20px;
             background:#1f6feb; color:#fff; border-radius:6px; text-decoration:none;">
            ← Go Back
          </a>
        </body>
      </html>
    `);
  }
};

const editBook = async (req, res) => {
  try {
    const book = await bookService.editBook(req.params.id, req.body);
    res.status(200).json({ message: "Book updated successfully", book });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await bookService.deleteBook(req.params.id);
    res.status(200).json({ message: "Book deleted successfully", book });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { 
  addBook,
  listBooks,
  getBookById,
  searchBooks,
  filterBooksByGenre,
  filterBooksByRating,
  filterBooksByPopularity,
  readBookPdf,
  editBook,
  deleteBook
};
