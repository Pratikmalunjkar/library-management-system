const pool = require("./src/config/db");
const { extractCoverFromPdf } = require("./src/utils/extractCover");
const path = require("path");

const updateCovers = async () => {
  try {
    const result = await pool.query(
      `SELECT id, title, pdf_storage_key 
       FROM books 
       WHERE cover_image_url IS NULL 
       AND pdf_storage_key IS NOT NULL
       AND is_active = true`
    );

    console.log(`Found ${result.rows.length} books without covers`);

    for (const book of result.rows) {
      console.log(`Processing: ${book.title}`);

      const pdfFileName = book.pdf_storage_key.replace("books/", "");
      const pdfFullPath = path.join(__dirname, "storage/books", pdfFileName);
      const coverFileName = `cover-${book.id}-${Date.now()}.jpg`;

      const coverUrl = await extractCoverFromPdf(pdfFullPath, coverFileName);

      if (coverUrl) {
        await pool.query(
          `UPDATE books SET cover_image_url = $1, updated_at = NOW() WHERE id = $2`,
          [coverUrl, book.id]
        );
        console.log(`✅ Cover updated for: ${book.title}`);
      } else {
        console.log(`❌ Failed to extract cover for: ${book.title}`);
      }
    }

    console.log("Done!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

updateCovers();