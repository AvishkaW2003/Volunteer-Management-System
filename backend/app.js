import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";  
import notificationRoutes from "./routes/notificationRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import organizerRoutes from "./routes/organizerRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import { getSettings, updateSettings, reports } from "./controllers/adminController.js";
import { getLeaderboard } from "./controllers/certificateController.js";
import authMiddleware from "./middleware/authMiddleware.js";
import roleMiddleware from "./middleware/roleMiddleware.js";
import errorHandler from "./middleware/errorHandler.js";
import xssSanitizer from "./middleware/xssSanitizer.js";

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(xssSanitizer);


// API Route Bindings
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/admin/logs", auditRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/organizer", organizerRoutes);
app.use("/api", reportRoutes);

// Direct mappings for settings and administrative dashboards
app.get("/api/reports/dashboard", authMiddleware, roleMiddleware("admin"), reports);
app.get("/api/settings", authMiddleware, roleMiddleware("admin"), getSettings);
app.put("/api/settings", authMiddleware, roleMiddleware("admin"), updateSettings);
app.get("/api/leaderboard", authMiddleware, getLeaderboard);

// Default status root page
app.get("/", (req, res) => {
  res.send("VolunteerHub Backend Running...");
});

// Mount the global centralized error handler
app.use(errorHandler);

export default app;
