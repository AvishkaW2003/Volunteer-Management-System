import express from "express";
import {
  getOrganizerSettings,
  updateOrganizerSettings,
} from "../controllers/organizerController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// GET  /api/organizer/settings  — load profile for Settings page
router.get(
  "/settings",
  authMiddleware,
  roleMiddleware("organizer"),
  getOrganizerSettings
);

// PUT  /api/organizer/settings  — save Settings page changes
router.put(
  "/settings",
  authMiddleware,
  roleMiddleware("organizer"),
  updateOrganizerSettings
);

export default router;
