import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./userModel.js";

const Event = sequelize.define("Event", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  eventDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },

  volunteerRequired: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

/*
Relationship
One user → many events
One event → belongs to one user
*/

User.hasMany(Event);

Event.belongsTo(User);

export default Event;