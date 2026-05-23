import express from "express";

import {

registerVolunteer,

getVolunteers,

}

from "../controllers/volunteerController.js";

import authMiddleware
from "../middleware/authMiddleware.js";

import roleMiddleware
from "../middleware/roleMiddleware.js";

const router =
express.Router();


// Student joins

router.post(
"/register/:eventId",

authMiddleware,

roleMiddleware(
"student"
),

registerVolunteer
);


// Organizer views

router.get(
"/event/:eventId",

authMiddleware,

roleMiddleware(
"organizer"
),

getVolunteers
);

export default router;