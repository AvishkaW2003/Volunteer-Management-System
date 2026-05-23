import Event from "../models/eventModel.js";

import VolunteerRegistration
from "../models/VolunteerRegistration.js";



export const registerVolunteer =
async (
req,
res
) => {

try {

const {
eventId
}
=
req.params;


// Check event
const event =
await Event.findByPk(
eventId
);

if (
!event
) {

return res
.status(404)
.json({

message:
"Event not found",

});

}


// Prevent duplicates

const exists =
await VolunteerRegistration
.findOne({

where: {

UserId:
req.user.id,

EventId:
eventId,

},

});


if (
exists
) {

return res
.status(400)
.json({

message:
"Already registered",

});

}


// Register

await VolunteerRegistration
.create({

UserId:
req.user.id,

EventId:
eventId,

});


res
.status(201)
.json({

message:
"Registered successfully",

});

}

catch (
error
) {

res
.status(500)
.json({

message:
error.message,

});

}

};





export const getVolunteers =
async (
req,
res
) => {

try {

const list =
await VolunteerRegistration
.findAll({

where: {

EventId:
req.params.eventId,

},

});

res
.status(200)
.json(
list
);

}

catch (
error
) {

res
.status(500)
.json({

message:
error.message,

});

}

};