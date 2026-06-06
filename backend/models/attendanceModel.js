import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./userModel.js";
import Event from "./eventModel.js";

const Attendance = sequelize.define(
  "Attendance",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Present = volunteer showed up, Absent = did not show up
    status: {
      type: DataTypes.ENUM("Present", "Absent"),
      defaultValue: "Absent",
    },
  },
  { timestamps: true }
);

// One attendance row links one volunteer to one event
Attendance.belongsTo(User, { foreignKey: "UserId", as: "volunteer" });
Attendance.belongsTo(Event, { foreignKey: "EventId", as: "event" });
User.hasMany(Attendance, { foreignKey: "UserId" });
Event.hasMany(Attendance, { foreignKey: "EventId" });

export default Attendance;
