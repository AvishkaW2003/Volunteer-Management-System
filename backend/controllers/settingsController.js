import * as settingsService from "../services/settingsService.js";
import AuditLog from "../models/auditLogModel.js";

export const getSettings = async (req, res) => {
  try {
    const settings = await settingsService.getSettings();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const settings = await settingsService.updateSettings(req.body);
    
    // Log the update action to the AuditLog table
    await AuditLog.create({
      action: "Settings Updated",
      performedBy: req.user.id,
      details: `Updated settings fields: ${Object.keys(req.body).join(", ")}`,
    });

    res.status(200).json({
      message: "Settings updated",
      settings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
