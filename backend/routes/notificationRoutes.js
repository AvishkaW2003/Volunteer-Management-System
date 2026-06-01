import express from "express";
import {

sendNotification,

getNotifications,

myNotifications,

markRead,

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


router.patch(
"/:id/read",

authMiddleware,

markRead
);

router.delete(
"/:id",

authMiddleware,

deleteNotification
);

export default router;