const express = require("express");
const multer = require("multer");
const { PythonShell } = require("python-shell");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// 1. DEFINE ABSOLUTE PATH for uploads
// This fixes the "ENOENT" error by telling Windows exactly where to look
const UPLOAD_DIR = path.join(__dirname, "uploads");

// 2. FORCE CREATION of the directory
if (!fs.existsSync(UPLOAD_DIR)) {
  console.log(`Directory missing. Creating: ${UPLOAD_DIR}`);
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use the absolute path variable
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/analyze", upload.single("audio"), (req, res) => {
  // Check if file was actually saved
  if (!req.file) {
    console.error("Error: No file uploaded.");
    return res.status(400).json({ error: "No audio file received" });
  }

  console.log(`Audio successfully saved to: ${req.file.path}`);

  let options = {
    mode: "text",
    // On Windows, sometimes 'python' works better than 'python3'.
    // If this fails, try changing it to the full path of your python.exe
    pythonPath: "python",
    pythonOptions: ["-u"],
    args: [req.file.path],
  };

  PythonShell.run("evaluator.py", options)
    .then((messages) => {
      // If Python returns nothing, handle it
      if (!messages || messages.length === 0) {
        throw new Error("Python script returned empty response");
      }
      const result = JSON.parse(messages[0]);
      res.json(result);
    })
    .catch((err) => {
      console.error("Python AI Error:", err);
      res.status(500).json({
        error: "AI Engine Failed",
        details: err.message,
      });
    });
});

app.listen(5000, () =>
  console.log(`Server running on port 5000\nSaving files to: ${UPLOAD_DIR}`)
);
