import express
from "express";

import authMiddleware
from "../middleware/authMiddleware.js";

import roleMiddleware
from "../middleware/roleMiddleware.js";

import {

createLog,

getLogs,

}

from "../controllers/auditController.js";

const router =
express.Router();

router.post(
"/",

authMiddleware,

roleMiddleware(
"admin"
),

createLog
);

router.get(
"/",

authMiddleware,

roleMiddleware(
"admin"
),

getLogs
);

export default router;