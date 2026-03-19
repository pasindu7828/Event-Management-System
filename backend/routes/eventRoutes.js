import express from "express";
import {
  requiredSignIn,
  isStudent,
  isOrganizerOrAdmin,
} from "../middleware/authMiddleware.js";
import {
  createEvent,
  deleteEvent,
  getEventById,
  getMyEvents,
  getMyRegistrations,
  getPublicEvents,
  registerForEvent,
  updateEvent,
} from "../controllers/eventController.js";
import upload from "../config/multer.js";

const router = express.Router();

// Public event listing
router.get("/public", getPublicEvents);
router.get("/public/:id", getEventById);

// Organizer/Admin event management
router.post("/create", requiredSignIn, isOrganizerOrAdmin, upload.single("image"), createEvent);
router.get("/my-events", requiredSignIn, isOrganizerOrAdmin, getMyEvents);
router.put("/update/:id", requiredSignIn, isOrganizerOrAdmin, upload.single("image"), updateEvent);
router.delete("/delete/:id", requiredSignIn, isOrganizerOrAdmin, deleteEvent);

// Student registration + payment simulation
router.post("/register/:id", requiredSignIn, isStudent, registerForEvent);
router.get("/my-registrations", requiredSignIn, isStudent, getMyRegistrations);

export default router;
