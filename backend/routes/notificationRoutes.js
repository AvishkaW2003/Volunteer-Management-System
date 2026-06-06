import express from "express";
import {
  sendNotification,
  getNotifications,
  myNotifications,
  markRead,
  markAllRead,
  deleteNotification,
}

from "../controllers/notificationController.js";

import authMiddleware
from "../middleware/authMiddleware.js";

import roleMiddleware
from "../middleware/roleMiddleware.js";

const router =
express.Router();


// Admin

router.post(
"/",

authMiddleware,

roleMiddleware(
"admin"
),

sendNotification
);


router.get(
"/",

authMiddleware,

roleMiddleware(
"admin"
),

getNotifications
);


// User

router.get(
"/my",

authMiddleware,

myNotifications
);


// Mark a single notification as read
router.patch("/:id/read", authMiddleware, markRead);

// Mark ALL unread notifications for this role as read
router.patch("/read-all", authMiddleware, markAllRead);

router.delete(
"/:id",

authMiddleware,

deleteNotification
);

export default router;