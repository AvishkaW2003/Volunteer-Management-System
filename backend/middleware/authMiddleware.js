import jwt from "jsonwebtoken";
import { getSettings } from "../services/settingsService.js";

const authMiddleware = async (req, res, next) => {
  try {
   
    const authHeader = req.headers.authorization;
    
    // Check token exists
    if (!authHeader) {
      return res.status(401).json({
        message: "Access denied. No token provided",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Store user data
    req.user = decoded;

    // Check Maintenance Mode
    const settings = await getSettings();
    if (settings && settings.maintenanceMode && decoded.role !== "admin") {
      return res.status(503).json({
        message: "VolunteerHub is currently undergoing maintenance. Please try again later.",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

export default authMiddleware;