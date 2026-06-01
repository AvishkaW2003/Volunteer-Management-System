import { DataTypes }
from "sequelize";

import sequelize
from "../config/db.js";

const Notification =
sequelize.define(
"Notification",
{

title: {

type:
DataTypes.STRING,

allowNull:
false,

},

message: {

type:
DataTypes.TEXT,

allowNull:
false,

},

role: {

type:
DataTypes.ENUM(
"student",
"organizer",
"admin"
),

allowNull:
false,

},

isRead: {

type:
DataTypes.BOOLEAN,

defaultValue:
false,

},

}

);

export default Notification;