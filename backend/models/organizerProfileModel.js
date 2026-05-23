import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./userModel.js";

const OrganizerProfile = sequelize.define(
  "OrganizerProfile",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "Users",
        key: "id",
      },
    },
    organizationName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

// Associations
User.hasOne(OrganizerProfile, {
  foreignKey: "userId",
  as: "organizerProfile",
  onDelete: "CASCADE",
});
OrganizerProfile.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export default OrganizerProfile;
