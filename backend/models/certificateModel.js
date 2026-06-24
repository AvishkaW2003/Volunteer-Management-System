import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./userModel.js";
import Event from "./eventModel.js";

const Certificate = sequelize.define(
  "Certificate",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    certificateNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    certificateUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // The date printed on the certificate
    issueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    // Volunteer hours shown on the certificate
    hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Which organizer (User.id) issued this certificate
    issuedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "eventId"],
      },
    ],
  }
);