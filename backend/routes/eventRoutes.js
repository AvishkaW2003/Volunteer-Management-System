import express from "express";

import {
  createEvent,
  getEvents,
    getEventById,
    updateEvent,
    deleteEvent
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

// View Single Event
router.get(
"/:id",
getEventById
);

// Update Event
router.put(
"/:id",
authMiddleware,
roleMiddleware(
"organizer"
),
updateEvent
);

// Delete Event
router.delete(
"/:id",
authMiddleware,
roleMiddleware(
"organizer"
),
deleteEvent
);

export default router;