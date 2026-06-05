import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./userModel.js";
import Event from "./eventModel.js";

const VolunteerRegistration = sequelize.define(
  "VolunteerRegistration",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Pending → organizer reviews, Approved → student joins event, Rejected → denied
    status: {
      type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
      defaultValue: "Pending",
    },
  },
  { timestamps: true }
);

// A student (User) can register for many events; an event can have many students
User.belongsToMany(Event, { through: VolunteerRegistration });
Event.belongsToMany(User, { through: VolunteerRegistration });

// Direct associations so we can do VolunteerRegistration.findAll({ include: [User, Event] })
VolunteerRegistration.belongsTo(User, { foreignKey: "UserId", as: "volunteer" });
VolunteerRegistration.belongsTo(Event, { foreignKey: "EventId", as: "event" });

export default VolunteerRegistration;
