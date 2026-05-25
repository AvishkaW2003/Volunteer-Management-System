import { DataTypes }
from "sequelize";

import sequelize
from "../config/db.js";

const AuditLog =
sequelize.define(
"AuditLog",
{

action: {

type:
DataTypes.STRING,

allowNull:
false,

},

performedBy: {

type:
DataTypes.INTEGER,

allowNull:
false,

},

details: {

type:
DataTypes.TEXT,

},

}

);

export default AuditLog;