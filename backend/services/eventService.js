import { Op } from "sequelize";
import Event from "../models/eventModel.js";
import User from "../models/userModel.js";
import VolunteerRegistration from "../models/volunteerRegistration.js";
import Attendance from "../models/attendanceModel.js";
import StudentProfile from "../models/studentProfileModel.js";
import { createNotification } from "./notificationService.js";

/**
 * Service to handle core event business logic and lifecycles.
 */
export const createEvent = async (eventData, organizerId) => {
  const event = await Event.create({
    ...eventData,
    UserId: organizerId,
    approvalStatus: "Pending",
    status: "Upcoming",
    acceptedCount: 0
  });

  await createNotification({
    userId: null,
    title: "New Event Created",
    message: "New event awaiting approval",
    role: "admin"
  });

  return event;
};

export const updateEvent = async (eventId, eventData, organizerId, userRole) => {
  const event = await Event.findByPk(eventId);
  if (!event) {
    const err = new Error("Event not found");
    err.statusCode = 404;
    throw err;
  }

  // Ownership check
  if (userRole !== "admin" && event.UserId !== organizerId) {
    const err = new Error("You can edit only your events");
    err.statusCode = 403;
    throw err;
  }

  // Archived check
  if (userRole !== "admin" && event.status === "Archived") {
    const err = new Error("Cannot edit archived events");
    err.statusCode = 400;
    throw err;
  }

  // Prevent direct modifications of keys/status columns during updates
  const updateData = { ...eventData };
  delete updateData.id;
  delete updateData.UserId;
  delete updateData.approvalStatus; // Maintain approval status

  await event.update(updateData);
  return event;
};

export const deleteEvent = async (eventId, userId, userRole) => {
  const event = await Event.findByPk(eventId);
  if (!event) {
    const err = new Error("Event not found");
    err.statusCode = 404;
    throw err;
  }

  // Security Check: Only event owner or admin can soft delete
  if (userRole !== "admin" && event.UserId !== userId) {
    const err = new Error("You can delete only your events");
    err.statusCode = 403;
    throw err;
  }

  // Soft delete: status is changed to Archived
  await event.update({ status: "Archived" });
  return event;
};

export const getOrganizerEvents = async (organizerId) => {
  const events = await Event.findAll({
    where: { UserId: organizerId },
    order: [["eventDate", "DESC"]]
  });

  // Include application counts
  const result = await Promise.all(events.map(async (e) => {
    const registrationsCount = await VolunteerRegistration.count({ where: { EventId: e.id } });
    const approvedCount = await VolunteerRegistration.count({ where: { EventId: e.id, status: "Approved" } });
    return {
      ...e.toJSON(),
      applicationsCount: registrationsCount,
      approvedVolunteersCount: approvedCount
    };
  }));

  return result;
};

export const getPublicEvents = async (filters) => {
  const { search, category, date } = filters;
  const whereClause = {
    approvalStatus: "Approved",
    status: {
      [Op.ne]: "Archived"
    }
  };

  if (search) {
    whereClause[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } }
    ];
  }

  if (category) {
    whereClause.category = category;
  }

  if (date) {
    whereClause.eventDate = date;
  }

  return await Event.findAll({
    where: whereClause,
    include: [{ model: User, attributes: ["name"] }],
    order: [["eventDate", "ASC"]]
  });
};

export const getEventDetails = async (eventId) => {
  const event = await Event.findByPk(eventId, {
    include: [{ model: User, attributes: ["id", "name", "email"] }]
  });

  if (!event) {
    const err = new Error("Event not found");
    err.statusCode = 404;
    throw err;
  }

  const availableSlots = Math.max(0, event.volunteerRequired - event.acceptedCount);

  return {
    ...event.toJSON(),
    availableSlots
  };
};

export const getPendingEvents = async () => {
  return await Event.findAll({
    where: { approvalStatus: "Pending" },
    include: [{ model: User, attributes: ["name"] }]
  });
};

export const approveEvent = async (eventId) => {
  const event = await Event.findByPk(eventId);
  if (!event) {
    const err = new Error("Event not found");
    err.statusCode = 404;
    throw err;
  }

  await event.update({ approvalStatus: "Approved" });

  await createNotification({
    userId: event.UserId,
    title: "Event Approved",
    message: "Your event has been approved",
    role: "organizer"
  });

  return event;
};

export const rejectEvent = async (eventId) => {
  const event = await Event.findByPk(eventId);
  if (!event) {
    const err = new Error("Event not found");
    err.statusCode = 404;
    throw err;
  }

  await event.update({ approvalStatus: "Rejected" });

  await createNotification({
    userId: event.UserId,
    title: "Event Rejected",
    message: "Your event has been rejected",
    role: "organizer"
  });

  return event;
};

export const getOrganizerDashboardStats = async (organizerId) => {
  const todayStr = new Date().toISOString().split("T")[0];

  const myEvents = await Event.findAll({
    where: { UserId: organizerId },
    order: [["eventDate", "DESC"]]
  });

  const eventIds = myEvents.map((e) => e.id);

  if (eventIds.length === 0) {
    return {
      activeEvents: 0,
      totalApplications: 0,
      approvedVolunteers: 0,
      successRate: "0%",
      myCreatedEvents: []
    };
  }

  const allApplications = await VolunteerRegistration.findAll({
    where: { EventId: eventIds }
  });

  const totalApplications = allApplications.length;
  const approvedVolunteers = allApplications.filter((app) => app.status === "Approved").length;

  const activeEventsCount = myEvents.filter(
    (e) => e.approvalStatus === "Approved" && e.eventDate >= todayStr
  ).length;

  const successRateStr = totalApplications > 0
    ? Math.round((approvedVolunteers / totalApplications) * 100) + "%"
    : "0%";

  return {
    activeEvents: activeEventsCount,
    totalApplications,
    approvedVolunteers,
    successRate: successRateStr
  };
};
