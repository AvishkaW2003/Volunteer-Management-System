import express from "express";

import authMiddleware
from "../middleware/authMiddleware.js";

import roleMiddleware
from "../middleware/roleMiddleware.js";

import {
dashboard,
getUsers,
getUserById,
createUser,
updateUser,
deleteUser,
getPendingEvents,
approveEvent,
rejectEvent,
reports
}
from "../controllers/adminController.js";
import settingsRoutes from "./settingsRoutes.js";

const router =
express.Router();



// Protect all admin routes
router.use(authMiddleware, roleMiddleware("admin"));

router.get(
"/dashboard",
dashboard
);

router.get(
"/users",
getUsers
);

router.get(
"/users/:id",
getUserById
);

router.post(
"/users",
createUser
);

router.put(
"/users/:id",
updateUser
);

router.delete(
"/users/:id",
deleteUser
);

router.get(
"/events/pending",
getPendingEvents
);

router.patch(
"/events/:id/approve",
approveEvent
);

router.patch(
"/events/:id/reject",
rejectEvent
);

router.get(
"/reports",
reports
);

router.get(
"/reports/dashboard",
reports
);

router.use("/settings", settingsRoutes);

export default router;