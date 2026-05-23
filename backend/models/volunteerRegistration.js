import { DataTypes } from "sequelize";

import sequelize from "../config/db.js";

import User from "./userModel.js";
import Event from "./eventModel.js";

const VolunteerRegistration =
sequelize.define(
"VolunteerRegistration",
{

id: {

type:
DataTypes.INTEGER,

autoIncrement:
true,

primaryKey:
true,

},

},
{
timestamps: true,
}
);


// Relations

User.belongsToMany(
Event,
{
through:
VolunteerRegistration,
}
);

Event.belongsToMany(
User,
{
through:
VolunteerRegistration,
}
);

export default VolunteerRegistration;