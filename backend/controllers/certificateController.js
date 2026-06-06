import Certificate from "../models/certificateModel.js";
import Event from "../models/eventModel.js";
import User from "../models/userModel.js";

// Get all certificates issued for the organizer's events
// Uses nested include: Certificate → Event (filtered by UserId = organizer)
export const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.findAll({
      include: [
        {
          model: Event,
          as: "event",
          attributes: ["id", "title"],
          // Only return certificates where the event belongs to this organizer
          where: { UserId: req.user.id },
        },
        {
          model: User,
          as: "volunteer",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const result = certificates.map((c) => ({
      id: c.id,
      volunteer: c.volunteer?.name,
      volunteerId: c.volunteer?.id,
      event: c.event?.title,
      eventId: c.event?.id,
      date: c.issueDate,
      hours: c.hours,
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Issue a certificate — organizer selects volunteer + event + hours
export const issueCertificate = async (req, res) => {
  try {
    const { userId, eventId, issueDate, hours } = req.body;

    if (!userId || !eventId || !issueDate || !hours) {
      return res.status(400).json({ message: "userId, eventId, issueDate, and hours are required" });
    }

    // Verify the event belongs to this organizer
    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.UserId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to issue certificates for this event" });
    }

    // Prevent duplicate certificate for same volunteer + event
    const exists = await Certificate.findOne({ where: { UserId: userId, EventId: eventId } });
    if (exists) {
      return res.status(400).json({ message: "Certificate already issued for this volunteer and event" });
    }

    const certificate = await Certificate.create({
      UserId: userId,
      EventId: eventId,
      issueDate,
      hours,
      issuedBy: req.user.id,
    });

    res.status(201).json({ message: "Certificate issued", certificate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
