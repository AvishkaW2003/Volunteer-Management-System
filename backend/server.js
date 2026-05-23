import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import User from "./models/userModel.js";
import StudentProfile from "./models/studentProfileModel.js";
import OrganizerProfile from "./models/organizerProfileModel.js";
import sequelize from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import Event from "./models/eventModel.js";
import eventRoutes from "./routes/eventRoutes.js";
import VolunteerRegistration from "./models/volunteerRegistration.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/volunteers", volunteerRoutes);
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


sequelize.sync({ force: true })
  .then(() => {
    console.log("Database synced");
  })
  .catch((err) => {
    console.log(err);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});