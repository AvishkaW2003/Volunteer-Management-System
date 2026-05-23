import express from "express";

import {
  createEvent,
  getEvents,
} from "../controllers/eventController.js";

import authMiddleware
from "../middleware/authMiddleware.js";

import roleMiddleware
from "../middleware/roleMiddleware.js";

const router =
express.Router();

// Create Event
router.post(
"/",
authMiddleware,
roleMiddleware(
"organizer"
),
createEvent
);

// View Events
router.get(
"/",
getEvents
);

export default router;