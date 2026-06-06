import sequelize from "../config/db.js";
import User from "../models/userModel.js";
import OrganizerProfile from "../models/organizerProfileModel.js";

// GET /api/organizer/settings
// Returns the organizer's user info + organization profile joined together
export const getOrganizerSettings = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "phone"],
      include: [{ model: OrganizerProfile, as: "organizerProfile" }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      orgName: user.organizerProfile?.organizationName || user.name,
      email: user.email,
      phone: user.phone || "",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/organizer/settings
// Updates users table (email, phone) and organizerprofiles table (organizationName)
// Both writes happen inside a transaction — if one fails, neither saves
export const updateOrganizerSettings = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { orgName, email, phone } = req.body;

    await User.update(
      { email, phone },
      { where: { id: req.user.id }, transaction }
    );

    await OrganizerProfile.update(
      { organizationName: orgName },
      { where: { userId: req.user.id }, transaction }
    );

    await transaction.commit();
    res.status(200).json({ message: "Settings updated successfully" });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }
};
