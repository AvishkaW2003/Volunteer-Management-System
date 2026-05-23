import Event from "../models/eventModel.js";

export const createEvent = async (
  req,
  res
) => {
  try {

    const event =
      await Event.create({
        ...req.body,

        UserId: req.user.id,
      });

    res.status(201).json({
      message:
        "Event created successfully",

      event,
    });

  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

export const getEvents =
async (
  req,
  res
) => {
  try {

    const events =
      await Event.findAll();

    res.json(events);

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }
};

// Get single event
export const getEventById =
async (req, res) => {

try {

const event =
await Event.findByPk(
req.params.id
);

if (!event) {
return res
.status(404)
.json({
message:
"Event not found",
});
}

res
.status(200)
.json(event);

}

catch (error) {

res
.status(500)
.json({
message:
error.message,
});

}

};



// Update event
export const updateEvent =
async (req, res) => {

try {

const event =
await Event.findByPk(
req.params.id
);

if (!event) {

return res
.status(404)
.json({

message:
"Event not found",

});

}


// Only owner allowed
if (
event.UserId !==
req.user.id
) {

return res
.status(403)
.json({

message:
"You can edit only your events",

});

}


await event.update(
req.body
);

res
.status(200)
.json({

message:
"Event updated",

event,

});

}

catch (error) {

res
.status(500)
.json({

message:
error.message,

});

}

};




// Delete event
export const deleteEvent =
async (req, res) => {

try {

const event =
await Event.findByPk(
req.params.id
);

if (!event) {

return res
.status(404)
.json({

message:
"Event not found",

});

}


if (
event.UserId !==
req.user.id
) {

return res
.status(403)
.json({

message:
"You can delete only your events",

});

}


await event.destroy();

res
.status(200)
.json({

message:
"Event deleted",

});

}

catch (error) {

res
.status(500)
.json({

message:
error.message,

});

}

};