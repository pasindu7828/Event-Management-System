// routes/paymentSlipRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  submitPaymentSlip,
  getMyPaymentSlips,
  getPaymentSlipDetails,
  updatePaymentSlip,
  cancelPaymentSlip,
  getEventPaymentSlips,
  getEventAttendees,
  approvePaymentSlip,
  rejectPaymentSlip,
  checkInAttendee,
  regenerateQRCode,
  downloadQRCode,
} from "../controllers/paymentSlipController.js";
import { requiredSignIn, isStudent, isOrganizerOrAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Ensure temp directory exists
const tempDir = "temp";
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Configure multer for temporary storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "slip-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only images and PDF files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter,
});

// ==================== STUDENT ROUTES ====================
router.post("/submit", requiredSignIn, isStudent, upload.single("slipImage"), submitPaymentSlip);
router.get("/my-registrations", requiredSignIn, isStudent, getMyPaymentSlips);
router.get("/:id", requiredSignIn, isStudent, getPaymentSlipDetails);
router.put("/:id", requiredSignIn, isStudent, upload.single("slipImage"), updatePaymentSlip);
router.delete("/:id", requiredSignIn, isStudent, cancelPaymentSlip);
router.get("/:id/download-qr", requiredSignIn, isStudent, downloadQRCode);

// ==================== ORGANIZER/ADMIN ROUTES ====================
router.get("/event/:eventId", requiredSignIn, isOrganizerOrAdmin, getEventPaymentSlips);
router.get("/event/:eventId/attendees", requiredSignIn, isOrganizerOrAdmin, getEventAttendees);
router.put("/:id/approve", requiredSignIn, isOrganizerOrAdmin, approvePaymentSlip);
router.put("/:id/reject", requiredSignIn, isOrganizerOrAdmin, rejectPaymentSlip);
router.put("/:id/regenerate-qr", requiredSignIn, isOrganizerOrAdmin, regenerateQRCode);
router.post("/check-in", requiredSignIn, isOrganizerOrAdmin, checkInAttendee);

export default router;