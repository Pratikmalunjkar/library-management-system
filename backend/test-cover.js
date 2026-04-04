const { extractCoverFromPdf } = require("./src/utils/extractCover");
const path = require("path");
const fs = require("fs");

// ✅ Get first PDF from storage/books
const booksDir = path.join(__dirname, "storage/books");
const files = fs.readdirSync(booksDir).filter(f => f.endsWith(".pdf"));

if (files.length === 0) {
  console.log("No PDF files found in storage/books");
  process.exit(1);
}

const firstPdf = path.join(booksDir, files[0]);
console.log("Testing with:", firstPdf);

extractCoverFromPdf(firstPdf, "test-cover.jpg")
  .then(result => {
    console.log("Result:", result);
    if (result) {
      console.log("✅ Cover extracted successfully!");
    } else {
      console.log("❌ Cover extraction returned null");
    }
  })
  .catch(err => {
    console.error("❌ Error:", err);
  });