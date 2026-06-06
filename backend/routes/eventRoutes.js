import express from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getMyEvents,
  getOrganizerStats,
} from "../controllers/eventController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public — student browse page sees all approved events
router.get("/", getEvents);
router.get("/:id", getEventById);

// Organizer — dashboard stats
router.get("/organizer/stats", authMiddleware, roleMiddleware("organizer"), getOrganizerStats);

// Organizer — only their own events (Manage Events page)
router.get("/organizer/mine", authMiddleware, roleMiddleware("organizer"), getMyEvents);

// Organizer — create, update, delete
router.post("/", authMiddleware, roleMiddleware("organizer"), createEvent);
router.put("/:id", authMiddleware, roleMiddleware("organizer"), updateEvent);
router.delete("/:id", authMiddleware, roleMiddleware("organizer"), deleteEvent);

export default router;
