import Event from "../models/eventModel.js";
import User from "../models/userModel.js";
import VolunteerRegistration from "../models/volunteerRegistration.js";

// Student applies for an event → creates a Pending row
export const registerVolunteer = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const exists = await VolunteerRegistration.findOne({
      where: { UserId: req.user.id, EventId: eventId },
    });
    if (exists) {
      return res.status(400).json({ message: "Already registered" });
    }

    const registration = await VolunteerRegistration.create({
      UserId: req.user.id,
      EventId: eventId,
      status: "Pending",
    });

    res.status(201).json({ message: "Applied successfully", registration });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Organizer sees all applications for their events
// JOIN fetches volunteer name+email and event title in one query
export const getApplicationsForOrganizer = async (req, res) => {
  try {
    // First find all events that belong to this organizer
    const myEvents = await Event.findAll({
      where: { UserId: req.user.id },
      attributes: ["id"],
    });
    const eventIds = myEvents.map((e) => e.id);

    if (eventIds.length === 0) {
      return res.status(200).json([]);
    }

    // Fetch registrations for those events, including volunteer and event details
    const applications = await VolunteerRegistration.findAll({
      where: { EventId: eventIds },
      include: [
        {
          model: User,
          as: "volunteer",
          attributes: ["id", "name", "email"],
        },
        {
          model: Event,
          as: "event",
          attributes: ["id", "title"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Shape the response to match what the frontend table expects
    const result = applications.map((app) => ({
      id: app.id,
      name: app.volunteer?.name,
      email: app.volunteer?.email,
      event: app.event?.title,
      appliedDate: app.createdAt.toISOString().split("T")[0],
      status: app.status,
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Organizer approves or rejects a specific application
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "Approved" or "Rejected"

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be Approved or Rejected" });
    }

    const application = await VolunteerRegistration.findByPk(id, {
      include: [{ model: Event, as: "event", attributes: ["UserId"] }],
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Security check — organizer can only update applications for their own events
    if (application.event.UserId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    await application.update({ status });
    res.status(200).json({ message: `Application ${status}`, application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Organizer views all volunteers for a specific event (used by Attendance page dropdown)
export const getVolunteers = async (req, res) => {
  try {
    const list = await VolunteerRegistration.findAll({
      where: { EventId: req.params.eventId, status: "Approved" },
      include: [
        {
          model: User,
          as: "volunteer",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    const result = list.map((r) => ({
      registrationId: r.id,
      userId: r.volunteer?.id,
      name: r.volunteer?.name,
      email: r.volunteer?.email,
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Student views their own event applications
export const getMyApplications = async (req, res) => {
  try {
    const applications = await VolunteerRegistration.findAll({
      where: { UserId: req.user.id },
      include: [
        {
          model: Event,
          as: "event",
          attributes: ["id", "title", "eventDate", "location", "status", "reputationPoints"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    const result = applications.map(app => ({
      id: app.id,
      eventId: app.event?.id,
      eventTitle: app.event?.title,
      eventDate: app.event?.eventDate,
      location: app.event?.location,
      appliedDate: app.createdAt.toISOString().split("T")[0],
      status: app.status,
      reputationPoints: app.event?.reputationPoints
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
