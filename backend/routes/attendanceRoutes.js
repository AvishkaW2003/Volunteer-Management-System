import express from "express";
import {
  getAttendanceByEvent,
  saveAttendance,
} from "../controllers/attendanceController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// GET /api/attendance/:eventId  — load volunteer list + current status
router.get(
  "/:eventId",
  authMiddleware,
  roleMiddleware("organizer"),
  getAttendanceByEvent
);

// POST /api/attendance  — bulk save attendance for all volunteers
router.post(
  "/",
  authMiddleware,
  roleMiddleware("organizer"),
  saveAttendance
);

export default router;
