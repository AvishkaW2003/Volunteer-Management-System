import Event from "../models/eventModel.js";
import User from "../models/userModel.js";
import VolunteerRegistration from "../models/volunteerRegistration.js";
import { getSettings } from "../services/settingsService.js";

export const createEvent = async (
  req,
  res
) => {
  try {
    const settings = await getSettings();

    // Max Events limit check
    const eventCount = await Event.count({ where: { UserId: req.user.id } });
    if (eventCount >= settings.maxEventsPerClub) {
      return res.status(400).json({
        message: `Maximum event creation limit of ${settings.maxEventsPerClub} events reached.`,
      });
    }

    // Set initial status based on approval toggle
    const initialStatus = settings.eventApprovalRequired ? "pending" : "approved";

    const event =
      await Event.create({
        ...req.body,
        UserId: req.user.id,
        status: initialStatus,
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
      await Event.findAll({
        include: [{ model: User, attributes: ["id", "name"] }],
        order: [["eventDate", "ASC"]],
      });

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




// Organizer's own events only — used by Manage Events page
export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { UserId: req.user.id },
      order: [["eventDate", "DESC"]],
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dashboard stats — counts for the logged-in organizer
export const getOrganizerStats = async (req, res) => {
  try {
    const myEvents = await Event.findAll({ where: { UserId: req.user.id } });
    const eventIds = myEvents.map((e) => e.id);

    const totalApplications = await VolunteerRegistration.count({
      where: { EventId: eventIds },
    });
    const approved = await VolunteerRegistration.count({
      where: { EventId: eventIds, status: "Approved" },
    });
    const activeEvents = myEvents.filter((e) => e.status === "approved").length;

    res.status(200).json({
      activeEvents,
      totalApplications,
      approvedVolunteers: approved,
      successRate:
        totalApplications > 0
          ? Math.round((approved / totalApplications) * 100) + "%"
          : "0%",
      recentEvents: myEvents.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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