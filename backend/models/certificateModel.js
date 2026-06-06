import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
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
    },
  },
  { timestamps: true }
);

// A certificate belongs to one volunteer and one event
Certificate.belongsTo(User, { foreignKey: "UserId", as: "volunteer" });
Certificate.belongsTo(Event, { foreignKey: "EventId", as: "event" });
User.hasMany(Certificate, { foreignKey: "UserId" });
Event.hasMany(Certificate, { foreignKey: "EventId" });

export default Certificate;
