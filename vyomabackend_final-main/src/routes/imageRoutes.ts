import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

let savedImage = null; // TEMP storage (testing only)

// ✅ ADD IMAGE
router.post("/image", upload.single("image"), (req, res) => {
  console.log("ADD FILE:", req.file);

  savedImage = req.file.filename;

  res.json({
    success: true,
    imageUrl: `http://localhost:3000/uploads/${req.file.filename}`,
  });
});

// ✅ UPDATE IMAGE
router.put("/image", upload.single("image"), (req, res) => {
  console.log("UPDATE FILE:", req.file);

  // delete old image
  if (savedImage) {
    fs.unlink(`uploads/${savedImage}`, () => {});
  }

  savedImage = req.file.filename;

  res.json({
    success: true,
    imageUrl: `http://localhost:3000/uploads/${req.file.filename}`,
  });
});

// ✅ DELETE IMAGE
router.delete("/image", (req, res) => {
  if (savedImage) {
    fs.unlink(`uploads/${savedImage}`, () => {});
    savedImage = null;
  }

  res.json({ success: true, message: "Image deleted" });
});

export default router;
