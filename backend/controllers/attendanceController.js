import Attendance from "../models/attendanceModel.js";
import Event from "../models/eventModel.js";
import User from "../models/userModel.js";
import VolunteerRegistration from "../models/volunteerRegistration.js";

// Get attendance records for one event
// Returns approved volunteers with their current Present/Absent status
export const getAttendanceByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Only the event owner can view attendance
    if (event.UserId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Get all approved volunteers for this event
    const registrations = await VolunteerRegistration.findAll({
      where: { EventId: eventId, status: "Approved" },
      include: [{ model: User, as: "volunteer", attributes: ["id", "name", "email"] }],
    });

    // Get any existing attendance records already saved
    const existingRecords = await Attendance.findAll({ where: { EventId: eventId } });
    const attendanceMap = {};
    existingRecords.forEach((r) => {
      attendanceMap[r.UserId] = r.status;
    });

    // Merge: each volunteer gets their saved status, or 'Absent' if not yet recorded
    const result = registrations.map((reg) => ({
      userId: reg.volunteer.id,
      name: reg.volunteer.name,
      email: reg.volunteer.email,
      status: attendanceMap[reg.volunteer.id] || "Absent",
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Save (or update) attendance for a whole event in one request
// Body: { eventId, records: [{ userId, status }] }
// Upsert means: create the row if it doesn't exist, update it if it does
export const saveAttendance = async (req, res) => {
  try {
    const { eventId, records } = req.body;

    if (!eventId || !Array.isArray(records)) {
      return res.status(400).json({ message: "eventId and records array are required" });
    }

    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.UserId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Process each volunteer record — upsert so re-saving is always safe
    const operations = records.map(({ userId, status }) =>
      Attendance.upsert({ UserId: userId, EventId: eventId, status })
    );
    await Promise.all(operations);

    res.status(200).json({ message: "Attendance saved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
