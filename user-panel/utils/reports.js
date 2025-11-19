import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import Report from "../models/Report.js"; // DB model

const router = express.Router();

// Multer memory storage
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/report → send image to Flask → store in DB
router.post("/report", upload.single("image"), async (req, res) => {
  try {
    const imageFile = req.file;
    const fields = req.body;

    if (!imageFile)
      return res.status(400).json({ success: false, message: "No image uploaded" });

    // Prepare form-data for Flask
    const flaskForm = new FormData();
    flaskForm.append("image", imageFile.buffer, imageFile.originalname);

    // Call Flask server for prediction
    const flaskRes = await axios.post(
      "http://127.0.0.1:5001/predict-image",
      flaskForm,
      { headers: flaskForm.getHeaders() }
    );

    const aiResult = flaskRes.data;

    // ---- SAVE EVERYTHING TO DB HERE ----
    const report = await Report.create({
      id: fields.id,
      type: fields.type,
      severity: fields.severity,
      location: fields.location,
      coords: JSON.parse(fields.coords), // if sent as JSON string
      description: fields.description,
      reportedDate: fields.reportedDate,
      aiResult: aiResult,
      status: "Pending"
    });

    return res.json({
      success: true,
      saved: true,
      report
    });

  } catch (err) {
    console.error("Error in /report:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
