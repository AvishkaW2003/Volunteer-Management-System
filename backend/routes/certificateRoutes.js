import express from "express";
import {
  getCertificates,
  issueCertificate,
} from "../controllers/certificateController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// GET /api/certificates  — list all certificates for this organizer's events
router.get(
  "/",
  authMiddleware,
  roleMiddleware("organizer"),
  getCertificates
);

// POST /api/certificates  — issue a new certificate
router.post(
  "/",
  authMiddleware,
  roleMiddleware("organizer"),
  issueCertificate
);

export default router;
