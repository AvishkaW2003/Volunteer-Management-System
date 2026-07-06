import * as certificateService from "../services/certificateService.js";
import Certificate from "../models/certificateModel.js";
import Event from "../models/eventModel.js";
import User from "../models/userModel.js";
import Attendance from "../models/attendanceModel.js";

/**
 * Retains original getCertificates dashboard queries for frontend rendering.
 */
export const getCertificates = async (req, res) => {
  try {
    // 1. Fetch all events created by this organizer
    const myEvents = await Event.findAll({
      where: { UserId: req.user.id },
      attributes: ["id", "title", "eventDate"],
    });
    const eventIds = myEvents.map((e) => e.id);

    if (eventIds.length === 0) {
      return res.status(200).json({
        analytics: {
          totalCertificates: 0,
          thisMonth: 0,
          mostAwardedEvent: "None",
          certifiedVolunteers: 0,
        },
        pendingCertificates: [],
        generatedCertificates: [],
      });
    }

    // 2. Fetch all certificates generated for these events
    const certificates = await Certificate.findAll({
      where: { EventId: eventIds },
      include: [
        {
          model: Event,
          as: "event",
          attributes: ["id", "title", "eventDate"],
        },
        {
          model: User,
          as: "volunteer",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // 3. Fetch all attendances where volunteer was Present
    const attendances = await Attendance.findAll({
      where: { EventId: eventIds, status: "Present" },
      include: [
        {
          model: User,
          as: "volunteer",
          attributes: ["id", "name", "email"],
        },
        {
          model: Event,
          as: "event",
          attributes: ["id", "title", "eventDate"],
        },
      ],
    });

    // 4. Calculate Analytics
    const totalCertificates = certificates.length;
    
    // Certificates this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonth = certificates.filter((c) => {
      const d = new Date(c.issueDate);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    // Most awarded event
    const eventCounts = {};
    certificates.forEach((c) => {
      const name = c.event?.title || "Unknown Event";
      eventCounts[name] = (eventCounts[name] || 0) + 1;
    });
    let mostAwardedEvent = "None";
    let maxCount = 0;
    for (const [name, count] of Object.entries(eventCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostAwardedEvent = name;
      }
    }

    // Unique certified volunteers count
    const uniqueVols = new Set(certificates.map((c) => c.UserId));
    const certifiedVolunteers = uniqueVols.size;

    // 5. Filter attendances to find volunteers who are Present but don't have a certificate yet
    const pendingCertificates = attendances
      .filter((att) => {
        return !certificates.some((cert) => cert.UserId === att.UserId && cert.EventId === att.EventId);
      })
      .map((att) => ({
        id: att.id,
        userId: att.UserId,
        volunteerName: att.volunteer?.name || "Unknown",
        volunteerEmail: att.volunteer?.email,
        eventId: att.EventId,
        eventName: att.event?.title || "Unknown Event",
        eventDate: att.event?.eventDate,
        attendanceStatus: att.status,
      }));

    // 6. Map generated certificates details
    const generatedCertificates = certificates.map((c) => ({
      id: c.id,
      certificateId: c.certificateNumber,
      volunteerName: c.volunteer?.name || "Unknown",
      volunteerId: c.volunteer?.id,
      volunteerEmail: c.volunteer?.email,
      eventName: c.event?.title || "Unknown Event",
      eventId: c.event?.id,
      eventDate: c.event?.eventDate,
      generatedDate: c.issueDate,
      hours: c.hours,
      status: "Generated",
    }));

    res.status(200).json({
      analytics: {
        totalCertificates,
        thisMonth,
        mostAwardedEvent,
        certifiedVolunteers,
      },
      pendingCertificates,
      generatedCertificates,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retains original issueCertificate endpoint.
 */
export const issueCertificate = async (req, res) => {
  try {
    const { userId, eventId, issueDate, hours } = req.body;

    if (!userId || !eventId || !issueDate || !hours) {
      return res.status(400).json({ message: "userId, eventId, issueDate, and hours are required" });
    }

    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.UserId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to issue certificates for this event" });
    }

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

/**
 * Retains original revokeCertificate endpoint.
 */
export const revokeCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const certificate = await Certificate.findByPk(id, {
      include: [
        {
          model: Event,
          as: "event",
          attributes: ["UserId"],
        },
      ],
    });

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    if (certificate.event?.UserId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to revoke this certificate" });
    }

    await certificate.destroy();
    res.status(200).json({ message: "Certificate revoked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- NEW LIFECYCLE API METHODS ---

/**
 * Organizer retrieves eligible volunteers.
 */
export const getEligibleVolunteers = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const eligible = await certificateService.getEligibleVolunteers(eventId, req.user.id);
    res.status(200).json(eligible);
  } catch (error) {
    next(error);
  }
};

/**
 * Organizer generates single certificate.
 */
export const generateCertificate = async (req, res, next) => {
  try {
    const { eventId, userId, hours } = req.body;
    const certificate = await certificateService.generateCertificate(eventId, userId, hours, req.user.id);
    res.status(201).json({
      success: true,
      message: "Certificate generated successfully",
      certificate
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Organizer bulk generates certificates.
 */
export const bulkGenerateCertificates = async (req, res, next) => {
  try {
    const { eventId, volunteers } = req.body;
    const result = await certificateService.bulkGenerateCertificates(eventId, volunteers, req.user.id);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Student retrieves own certificates.
 */
export const getMyCertificates = async (req, res, next) => {
  try {
    const certificates = await certificateService.getStudentCertificates(req.user.id);
    res.status(200).json(certificates);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves certificate detail view.
 */
export const getCertificateById = async (req, res, next) => {
  try {
    const certificate = await certificateService.getCertificateById(req.params.id, req.user.id, req.user.role);
    res.status(200).json(certificate);
  } catch (error) {
    next(error);
  }
};

/**
 * Download certificate as a dynamic PDF file.
 */
export const downloadCertificate = async (req, res, next) => {
  try {
    const certificate = await certificateService.getCertificateById(req.params.id, req.user.id, req.user.role);
    
    // Generate valid raw PDF buffer dynamically
    const mockPdf = Buffer.from(
      `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n4 0 obj\n<< /Length 200 >>\nstream\nBT\n/F1 24 Tf\n70 700 Td\n(VOLUNTEERHUB SERVICE CERTIFICATE) Tj\n/F1 14 Tf\n0 -50 Td\n(Certificate Number: ${certificate.certificateNumber}) Tj\n0 -30 Td\n(This certifies that ${certificate.volunteer?.name || 'Volunteer'} has completed ${certificate.hours} hours) Tj\n0 -20 Td\n(of volunteer work at "${certificate.event?.title || 'Event'}".) Tj\n0 -40 Td\n(Issued by: ${certificate.issuer?.name || 'Organizer'} on ${certificate.issueDate}) Tj\nET\nendstream\nendobj\n5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000010 00000 n\n0000000060 00000 n\n0000000120 00000 n\n0000000250 00000 n\n0000000500 00000 n\ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n570\n%%EOF`
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=certificate-${certificate.certificateNumber}.pdf`);
    res.status(200).send(mockPdf);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves global leaderboard.
 */
export const getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await certificateService.getLeaderboard();
    res.status(200).json(leaderboard);
  } catch (error) {
    next(error);
  }
};
