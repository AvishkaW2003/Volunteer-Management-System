export const validateRegistration = (req, res, next) => {
  const { role, name, email, password, phone, clubName, contactNumber, studentId, faculty } = req.body;

  // Common validations
  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "A valid email is required" });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }
  if (!role || !["student", "organizer", "admin"].includes(role)) {
    return res.status(400).json({ message: "A valid role (student, organizer, or admin) is required" });
  }

  if (role === "student") {
    const finalName = name || req.body.fullName;
    if (!finalName) {
      return res.status(400).json({ message: "Full Name is required for student" });
    }
    if (!faculty) {
      return res.status(400).json({ message: "Faculty is required for student" });
    }
    if (studentId && !/^STU\d{6}$/.test(studentId)) {
      return res.status(400).json({ message: "Student ID must be in format STU123456" });
    }
  } else if (role === "organizer") {
    const finalOrgName = clubName || req.body.organizationName || name;
    if (!finalOrgName) {
      return res.status(400).json({ message: "Club/Organization Name is required for organizer" });
    }
    const finalPhone = phone || contactNumber;
    if (!finalPhone) {
      return res.status(400).json({ message: "Contact Number is required for organizer" });
    }
    // Phone validation regex allowing +, spaces, digits, parentheses, dashes
    const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;
    if (!phoneRegex.test(finalPhone)) {
      return res.status(400).json({ message: "Invalid contact number format" });
    }

    } else if (role === "admin") {
    if (!name) {
      return res.status(400).json({ message: "Name is required for admin" });
    }

       if (!req.body.accessCode) {
      return res.status(400).json({ message: "Admin access code is required" });
    }
    if (req.body.accessCode !== "admin123" && req.body.accessCode !== "VOMS_ADMIN_2026") {
      return res.status(400).json({ message: "Invalid admin access code" });
    }
    if (!req.body.department) {
      return res.status(400).json({ message: "Department is required for admin" });
    }

  }

  next();
};

export const validateStudentRegistration = (req, res, next) => {
  req.body.role = "student";
  validateRegistration(req, res, next);
};

export const validateOrganizerRegistration = (req, res, next) => {
  req.body.role = "organizer";
  validateRegistration(req, res, next);
};

export const validateEvent = (req, res, next) => {
  const { title, description, location, eventDate, volunteerRequired } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ message: "Event title is required" });
  }
  if (!description || typeof description !== "string" || description.trim() === "") {
    return res.status(400).json({ message: "Event description is required" });
  }
  if (!location || typeof location !== "string" || location.trim() === "") {
    return res.status(400).json({ message: "Event location is required" });
  }
  if (!eventDate) {
    return res.status(400).json({ message: "Event date is required" });
  }
  if (volunteerRequired === undefined || isNaN(parseInt(volunteerRequired)) || parseInt(volunteerRequired) <= 0) {
    return res.status(400).json({ message: "Volunteer count must be a positive number" });
  }

  next();
};

export const validateApplication = (req, res, next) => {
  const { eventId } = req.body;

  if (eventId === undefined || isNaN(parseInt(eventId)) || parseInt(eventId) <= 0) {
    return res.status(400).json({ message: "A valid Event ID is required" });
  }

  next();
};

export const validateMarkAttendance = (req, res, next) => {
  const { eventId, userId, status } = req.body;

  if (eventId === undefined || isNaN(parseInt(eventId)) || parseInt(eventId) <= 0) {
    return res.status(400).json({ message: "A valid Event ID is required" });
  }
  if (userId === undefined || isNaN(parseInt(userId)) || parseInt(userId) <= 0) {
    return res.status(400).json({ message: "A valid User ID is required" });
  }
  if (!status || !["Present", "Absent"].includes(status)) {
    return res.status(400).json({ message: "Status must be either Present or Absent" });
  }

  next();
};

export const validateBulkMarkAttendance = (req, res, next) => {
  const { eventId } = req.body;
  const attendeesList = req.body.attendees || req.body.records;

  if (eventId === undefined || isNaN(parseInt(eventId)) || parseInt(eventId) <= 0) {
    return res.status(400).json({ message: "A valid Event ID is required" });
  }
  if (!Array.isArray(attendeesList) || attendeesList.length === 0) {
    return res.status(400).json({ message: "Attendees records list is required and cannot be empty" });
  }

  for (const record of attendeesList) {
    if (!record.userId || isNaN(parseInt(record.userId))) {
      return res.status(400).json({ message: "Each attendee record must contain a valid userId" });
    }
    if (!record.status || !["Present", "Absent"].includes(record.status)) {
      return res.status(400).json({ message: "Each attendee status must be either Present or Absent" });
    }
  }

  next();
};

export const validateGenerateCertificate = (req, res, next) => {
  const { eventId, userId, hours } = req.body;

  if (eventId === undefined || isNaN(parseInt(eventId)) || parseInt(eventId) <= 0) {
    return res.status(400).json({ message: "A valid Event ID is required" });
  }
  if (userId === undefined || isNaN(parseInt(userId)) || parseInt(userId) <= 0) {
    return res.status(400).json({ message: "A valid User ID is required" });
  }
  if (hours === undefined || isNaN(parseInt(hours)) || parseInt(hours) < 0) {
    return res.status(400).json({ message: "Hours must be a non-negative number" });
  }

  next();
};

export const validateBulkCertificate = (req, res, next) => {
  const { eventId, volunteers } = req.body;

  if (eventId === undefined || isNaN(parseInt(eventId)) || parseInt(eventId) <= 0) {
    return res.status(400).json({ message: "A valid Event ID is required" });
  }
  if (!Array.isArray(volunteers) || volunteers.length === 0) {
    return res.status(400).json({ message: "Volunteers list is required and cannot be empty" });
  }

  for (const vol of volunteers) {
    if (!vol.userId || isNaN(parseInt(vol.userId))) {
      return res.status(400).json({ message: "Each volunteer record must contain a valid userId" });
    }
    if (vol.hours === undefined || isNaN(parseInt(vol.hours)) || parseInt(vol.hours) < 0) {
      return res.status(400).json({ message: "Each volunteer record must contain valid hours" });
    }
  }

  next();
};





