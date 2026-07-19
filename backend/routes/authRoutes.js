import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { 
  validateStudentRegistration, 
  validateOrganizerRegistration 
} from "../middleware/validationMiddleware.js";
import { 
  registerStudent, 
  registerOrganizer, 
  login, 
  getMe, 
  forgotPassword, 
  resetPassword,
  googleLogin,
  googleRegisterOrganizer
} from "../controllers/authController.js";
import { authRateLimiter, resetRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/register/student", authRateLimiter, validateStudentRegistration, registerStudent);
router.post("/register/organizer", authRateLimiter, validateOrganizerRegistration, registerOrganizer);
router.post("/login", authRateLimiter, login);
router.post("/google-login", authRateLimiter, googleLogin);
router.post("/google-register/organizer", authRateLimiter, googleRegisterOrganizer);
router.get("/me", authMiddleware, getMe);
router.post("/forgot-password", resetRateLimiter, forgotPassword);
router.post("/reset-password/:token", resetRateLimiter, resetPassword);


export default router;