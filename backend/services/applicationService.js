import VolunteerRegistration from "../models/volunteerRegistration.js";
import Event from "../models/eventModel.js";
import User from "../models/userModel.js";
import { createNotification } from "./notificationService.js";
import StudentProfile from "../models/studentProfileModel.js";
import sequelize from "../config/database.js";

/**
 * Applies for a volunteer event.
 */
export const applyToEvent = async (studentId, eventId, formData) => {
  const event = await Event.findByPk(eventId);
  if (!event) {
    const err = new Error("Event not found");
    err.statusCode = 404;
    throw err;
  }

  // Business Rules: Cannot apply to pending/rejected/archived events
  if (event.approvalStatus !== "Approved") {
    const err = new Error("Cannot apply to pending or rejected events");
    err.statusCode = 400;
    throw err;
  }

  if (event.status === "Archived") {
    const err = new Error("Cannot apply to archived events");
    err.statusCode = 400;
    throw err;
  }

  // Check duplicate registration
  const duplicate = await VolunteerRegistration.findOne({
    where: { UserId: studentId, EventId: eventId }
  });
  if (duplicate) {
    const err = new Error("You have already applied to this event");
    err.statusCode = 400;
    throw err;
  }

  // Create Volunteer Registration
  const application = await VolunteerRegistration.create({
    UserId: studentId,
    EventId: eventId,
    formData,
    status: "Pending"
  });

  // Create Organizer Notification
  await createNotification({
    userId: event.UserId,
    title: "New application received",
    message: "New application received",
    role: "organizer"
  });

  return application;
};

/**
 * Retrieves student applications.
 */
export const getStudentApplications = async (studentId) => {
  return await VolunteerRegistration.findAll({
    where: { UserId: studentId },
    include: [
      {
        model: Event,
        as: "event",
        include: [{ model: User, attributes: ["id", "name", "email"] }] // Organizer info
      }
    ],
    order: [["createdAt", "DESC"]]
  });
};

/**
 * Retrieves application details by ID with authorization checks.
 */
export const getApplicationById = async (applicationId, userId, userRole) => {
  const application = await VolunteerRegistration.findByPk(applicationId, {
    include: [
      {
        model: User,
        as: "volunteer",
        attributes: ["id", "name", "email"],
        include: [{ model: StudentProfile, as: "studentProfile" }]
      },
      {
        model: Event,
        as: "event",
        include: [{ model: User, attributes: ["id", "name", "email"] }] // Organizer info
      }
    ]
  });

  if (!application) {
    const err = new Error("Application not found");
    err.statusCode = 404;
    throw err;
  }

  // Authorization checks
  if (userRole === "student" && application.UserId !== userId) {
    const err = new Error("Access denied: You can only view your own applications");
    err.statusCode = 403;
    throw err;
  }

  if (userRole === "organizer" && application.event.UserId !== userId) {
    const err = new Error("Access denied: You can only view applications for your own events");
    err.statusCode = 403;
    throw err;
  }

  if (userRole !== "admin" && userRole !== "student" && userRole !== "organizer") {
    const err = new Error("Access denied");
    err.statusCode = 403;
    throw err;
  }

  return application;
};

/**
 * Retrieves applications for a specific event (Organizer only).
 */
export const getOrganizerApplications = async (eventId, organizerId) => {
  const event = await Event.findByPk(eventId);
  if (!event) {
    const err = new Error("Event not found");
    err.statusCode = 404;
    throw err;
  }

  if (event.UserId !== organizerId) {
    const err = new Error("Access denied: You can only manage applications for your own events");
    err.statusCode = 403;
    throw err;
  }

  return await VolunteerRegistration.findAll({
    where: { EventId: eventId },
    include: [
      {
        model: User,
        as: "volunteer",
        attributes: ["id", "name", "email"],
        include: [{ model: StudentProfile, as: "studentProfile" }]
      }
    ],
    order: [["createdAt", "DESC"]]
  });
};

/**
 * Approves an application.
 */
export const approveApplication = async (applicationId, organizerId) => {
  const transaction = await sequelize.transaction();
  try {
    const application = await VolunteerRegistration.findByPk(applicationId, {
      include: [{ model: Event, as: "event" }],
      transaction
    });

    if (!application) {
      const err = new Error("Application not found");
      err.statusCode = 404;
      throw err;
    }

    if (application.event.UserId !== organizerId) {
      const err = new Error("You can only manage applications for your own events");
      err.statusCode = 403;
      throw err;
    }

    if (application.status === "Approved") {
      await transaction.commit();
      return application;
    }

    const oldStatus = application.status;
    await application.update({ status: "Approved" }, { transaction });

    // Increment Event.acceptedCount
    const event = application.event;
    await event.update({ acceptedCount: event.acceptedCount + 1 }, { transaction });

    // Create Student Notification
    await createNotification({
      userId: application.UserId,
      title: "Your application has been approved",
      message: "Your application has been approved",
      role: "student"
    }, { transaction });

    await transaction.commit();
    return application;
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * Rejects an application.
 */
export const rejectApplication = async (applicationId, organizerId) => {
  const transaction = await sequelize.transaction();
  try {
    const application = await VolunteerRegistration.findByPk(applicationId, {
      include: [{ model: Event, as: "event" }],
      transaction
    });

    if (!application) {
      const err = new Error("Application not found");
      err.statusCode = 404;
      throw err;
    }

    if (application.event.UserId !== organizerId) {
      const err = new Error("You can only manage applications for your own events");
      err.statusCode = 403;
      throw err;
    }

    const oldStatus = application.status;
    await application.update({ status: "Rejected" }, { transaction });

    // If it was previously approved, decrement acceptedCount
    if (oldStatus === "Approved") {
      const event = application.event;
      await event.update({ acceptedCount: Math.max(0, event.acceptedCount - 1) }, { transaction });
    }

    // Create Student Notification
    await createNotification({
      userId: application.UserId,
      title: "Your application has been rejected",
      message: "Your application has been rejected",
      role: "student"
    }, { transaction });

    await transaction.commit();
    return application;
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * Retrieves application statistics for organizer's events.
 */
export const getOrganizerApplicationStats = async (organizerId) => {
  const myEvents = await Event.findAll({
    where: { UserId: organizerId },
    attributes: ["id"]
  });

  const eventIds = myEvents.map(e => e.id);

  if (eventIds.length === 0) {
    return {
      totalApplications: 0,
      approvedApplications: 0,
      rejectedApplications: 0,
      pendingApplications: 0
    };
  }

  const totalApplications = await VolunteerRegistration.count({ where: { EventId: eventIds } });
  const approvedApplications = await VolunteerRegistration.count({ where: { EventId: eventIds, status: "Approved" } });
  const rejectedApplications = await VolunteerRegistration.count({ where: { EventId: eventIds, status: "Rejected" } });
  const pendingApplications = await VolunteerRegistration.count({ where: { EventId: eventIds, status: "Pending" } });

  return {
    totalApplications,
    approvedApplications,
    rejectedApplications,
    pendingApplications
  };
};
