import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

function ReadBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [pdf, setPdf] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  // ✅ Disable right click
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  // ✅ Load PDF
  useEffect(() => {
    const loadPdf = async () => {
      try {
        setLoading(true);
        setError(null);

        const loadingTask = pdfjsLib.getDocument({
          url: `http://localhost:5000/api/books/read/${id}`,
          httpHeaders: {
            Authorization: `Bearer ${token}`
          }
        });

        const pdfDoc = await loadingTask.promise;
        setPdf(pdfDoc);
        setNumPages(pdfDoc.numPages);
        setLoading(false);
      } catch (err) {
        console.error("PDF load error:", err);
        setError("Failed to load PDF. Please try again.");
        setLoading(false);
      }
    };

    if (token) {
      loadPdf();
    } else {
      setError("Please login again to read this book.");
      setLoading(false);
    }
  }, [id, token]);

  // ✅ Render page on canvas (FIXED VERSION)
  useEffect(() => {
    let renderTask = null;

    const renderPage = async () => {
      if (!pdf || !canvasRef.current) return;

      try {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.9 });

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // ✅ Cancel previous render
        if (renderTask) {
          renderTask.cancel();
        }

        renderTask = page.render({
          canvasContext: context,
          viewport: viewport
        });

        await renderTask.promise;
      } catch (err) {
        if (err?.name === "RenderingCancelledException") return;
        console.error("Render error:", err);
      }
    };

    renderPage();

    // ✅ Cleanup
    return () => {
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdf, pageNumber]);

  const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages));

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate(`/books/${id}`)}>
          Back to Details
        </button>
        <span style={styles.title}>Secure Book Reader</span>
        <span style={styles.warning}>Download disabled</span>
      </div>

      {/* PDF Viewer */}
      <div style={styles.viewerContainer}>
        {loading && (
          <p style={styles.loadingText}>Loading PDF...</p>
        )}

        {error && (
          <p style={styles.errorText}>{error}</p>
        )}

        {!loading && !error && (
          <canvas
            ref={canvasRef}
            style={styles.canvas}
          />
        )}
      </div>

      {/* Page Controls */}
      {numPages > 0 && (
        <div style={styles.controls}>
          <button
            style={{
              ...styles.controlBtn,
              opacity: pageNumber <= 1 ? 0.5 : 1,
              cursor: pageNumber <= 1 ? "not-allowed" : "pointer"
            }}
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
          >
            Previous
          </button>

          <span style={styles.pageInfo}>
            Page {pageNumber} of {numPages}
          </span>

          <button
            style={{
              ...styles.controlBtn,
              opacity: pageNumber >= numPages ? 0.5 : 1,
              cursor: pageNumber >= numPages ? "not-allowed" : "pointer"
            }}
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#1a1a2e",
    display: "flex",
    flexDirection: "column",
    userSelect: "none",
    WebkitUserSelect: "none",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 24px",
    backgroundColor: "#16213e",
    borderBottom: "1px solid #0f3460",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  backButton: {
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#555",
    color: "#fff",
    cursor: "pointer",
  },
  title: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: "16px",
  },
  warning: {
    color: "#e74c3c",
    fontSize: "13px",
    fontWeight: "600",
  },
  viewerContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "20px",
    overflowY: "auto",
  },
  canvas: {
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
    borderRadius: "4px",
    maxWidth: "100%",
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    padding: "16px",
    backgroundColor: "#16213e",
    borderTop: "1px solid #0f3460",
    position: "sticky",
    bottom: 0,
  },
  controlBtn: {
    padding: "8px 20px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#1f6feb",
    color: "#fff",
    fontWeight: "600",
    fontSize: "14px",
  },
  pageInfo: {
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    minWidth: "120px",
    textAlign: "center",
  },
  loadingText: {
    color: "#ffffff",
    fontSize: "16px",
    padding: "40px",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: "16px",
    padding: "40px",
    textAlign: "center",
  },
};

export default ReadBookPage;