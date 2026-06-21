import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import { seedDatabase } from "./config/seed.js";
import User from "./models/userModel.js";
import StudentProfile from "./models/studentProfileModel.js";
import OrganizerProfile from "./models/organizerProfileModel.js";
import sequelize from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import Event from "./models/eventModel.js";
import eventRoutes from "./routes/eventRoutes.js";
import VolunteerRegistration from "./models/volunteerRegistration.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";  
import SystemSetting from "./models/systemSetting.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import Notification from "./models/notificationModel.js";
import AuditLog from "./models/auditLogModel.js";
import auditRoutes from "./routes/auditRoutes.js";
import Attendance from "./models/attendanceModel.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import Certificate from "./models/certificateModel.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import organizerRoutes from "./routes/organizerRoutes.js";
import { getSettings, updateSettings, reports } from "./controllers/adminController.js";
import authMiddleware from "./middleware/authMiddleware.js";
import roleMiddleware from "./middleware/roleMiddleware.js";



dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/admin/logs", auditRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/organizer", organizerRoutes);

// Direct mapping of settings & reports
app.get("/api/reports/dashboard", authMiddleware, roleMiddleware("admin"), reports);
app.get("/api/settings", authMiddleware, roleMiddleware("admin"), getSettings);
app.put("/api/settings", authMiddleware, roleMiddleware("admin"), updateSettings);

app.get("/", (req, res) => {
  res.send("VolunteerHub Backend Running...");
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
  });

sequelize.sync()
  .then(async () => {
   console.log("Database synced");
    await seedDatabase();
  })
  .catch((err) => {
    console.log(err);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});