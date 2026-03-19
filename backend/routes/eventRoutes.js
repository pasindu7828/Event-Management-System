import express from "express";
import {
  requiredSignIn,
  isOrganizerOrAdmin,
} from "../middleware/authMiddleware.js";
import {
  createEvent,
  getMyEvents,
  getPublicEvents,
} from "../controllers/eventController.js";

const router = express.Router();

// Public event listing
router.get("/public", getPublicEvents);

// Organizer/Admin event management
router.post("/create", requiredSignIn, isOrganizerOrAdmin, createEvent);
router.get("/my-events", requiredSignIn, isOrganizerOrAdmin, getMyEvents);

export default router;
