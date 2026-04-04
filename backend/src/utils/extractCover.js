const fs = require("fs");
const path = require("path");
const { createCanvas, Canvas, Image, ImageData } = require("canvas");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

pdfjsLib.GlobalWorkerOptions.workerSrc = false;

// ✅ Custom Canvas Factory for Node.js
class NodeCanvasFactory {
  create(width, height) {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");
    return { canvas, context };
  }

  reset(canvasAndContext, width, height) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  destroy(canvasAndContext) {
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
}

const extractCoverFromPdf = async (pdfPath, outputFileName) => {
  try {
    console.log("Extracting cover from:", pdfPath);

    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const canvasFactory = new NodeCanvasFactory();

    const loadingTask = pdfjsLib.getDocument({
      data,
      canvasFactory
    });

    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvasAndContext = canvasFactory.create(viewport.width, viewport.height);

    await page.render({
      canvasContext: canvasAndContext.context,
      viewport: viewport,
      canvasFactory
    }).promise;

    // ✅ Save as JPG
    const outputDir = path.join(process.cwd(), "storage/covers");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, outputFileName);
    const buffer = canvasAndContext.canvas.toBuffer("image/jpeg", { quality: 0.85 });
    fs.writeFileSync(outputPath, buffer);

    console.log("✅ Cover saved to:", outputPath);
    return `covers/${outputFileName}`;

  } catch (err) {
    console.error("Cover extraction error:", err.message);
    return null;
  }
};

module.exports = { extractCoverFromPdf };