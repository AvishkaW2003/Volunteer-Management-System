export const validateRegistration = (req, res, next) => {
  const { role, name, email, password, phone, clubName, contactNumber, studentId, faculty } = req.body;

  // Common validations
  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "A valid email is required" });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }
  if (!role || !["student", "organizer"].includes(role)) {
    return res.status(400).json({ message: "A valid role (student or organizer) is required" });
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
  }

  next();
};
