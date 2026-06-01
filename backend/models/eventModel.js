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
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
  },

  
  image: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800",
  },
  time: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "10:00 AM",
  },
  reputationPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
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