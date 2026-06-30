import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { Op } from "sequelize";
import sequelize from "../config/database.js";
import User from "../models/userModel.js";
import StudentProfile from "../models/studentProfileModel.js";
import OrganizerProfile from "../models/organizerProfileModel.js";
import jwtConfig from "../config/jwt.js";

/**
 * Service handling all core auth business logic.
 */
export const registerStudent = async (studentData) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, email, password, phone, studentId, faculty } = studentData;

    // Check duplicate email
    const duplicate = await User.findOne({ where: { email }, transaction });
    if (duplicate) {
      const err = new Error("Email already registered");
      err.statusCode = 400;
      throw err;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Base User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "student",
      status: "active"
    }, { transaction });

    // Create Student Profile
    const studentProfile = await StudentProfile.create({
      userId: user.id,
      studentId,
      faculty,
      skills: []
    }, { transaction });

    await transaction.commit();

    const result = user.toJSON();
    delete result.password;
    result.studentProfile = studentProfile.toJSON();

    return result;
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    throw error;
  }
};

export const registerOrganizer = async (organizerData) => {
  const transaction = await sequelize.transaction();
  try {
    const { organizationName, email, password, phone } = organizerData;

    // Check duplicate email
    const duplicate = await User.findOne({ where: { email }, transaction });
    if (duplicate) {
      const err = new Error("Email already registered");
      err.statusCode = 400;
      throw err;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Base User
    const user = await User.create({
      name: organizationName,
      email,
      password: hashedPassword,
      phone,
      role: "organizer",
      status: "active"
    }, { transaction });

    // Create Organizer Profile
    const organizerProfile = await OrganizerProfile.create({
      userId: user.id,
      organizationName
    }, { transaction });

    await transaction.commit();

    const result = user.toJSON();
    delete result.password;
    result.organizerProfile = organizerProfile.toJSON();

    return result;
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    throw error;
  }
};

export const loginUser = async ({ email, password }) => {
  // Find user including profiles
  const user = await User.findOne({
    where: { email },
    include: [
      { model: StudentProfile, as: "studentProfile" },
      { model: OrganizerProfile, as: "organizerProfile" }
    ]
  });

  if (!user) {
    const err = new Error("Invalid email or password");
    err.statusCode = 400;
    throw err;
  }

  // Check suspended status
  if (user.status === "suspended") {
    const err = new Error("Your account has been suspended. Please contact administration.");
    err.statusCode = 403;
    throw err;
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Invalid email or password");
    err.statusCode = 400;
    throw err;
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

  const userJson = user.toJSON();
  delete userJson.password;

  return {
    token,
    user: userJson
  };
};

export const getUserIdentity = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ["id", "name", "email", "role"],
    include: [
      { model: StudentProfile, as: "studentProfile" },
      { model: OrganizerProfile, as: "organizerProfile" }
    ]
  });

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  return user.toJSON();
};

export const forgotPassword = async (email) => {
  const user = await User.findOne({ where: { email } });
  
  // Generate token regardless of user existence to avoid timing attacks/leaks
  const resetToken = crypto.randomBytes(32).toString("hex");

  if (!user) {
    // Suppress error and return dummy token to prevent email enumeration
    console.log(`[FORGOT PASSWORD] Requested email ${email} not found in database. Suppressing error.`);
    return resetToken;
  }

  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  const tokenExpiry = Date.now() + 3600000; // 1 hour expiration

  // Update user model with hash token and expiration
  await user.update({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: tokenExpiry
  });

  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

  // Log mocked email reset link to console for testing
  console.log(`[MOCKED EMAIL SEND] Password Reset Request for ${email}`);
  console.log(`Reset Token: ${resetToken}`);
  console.log(`Hashed Token Stored: ${hashedToken}`);
  console.log(`Reset URL: ${resetUrl}`);

  // Send real email via nodemailer if config exists
  const smtpHost = process.env.EMAIL_HOST;
  const smtpPort = process.env.EMAIL_PORT;
  const smtpUser = process.env.EMAIL_USER;
  const smtpPass = process.env.EMAIL_PASS;
  const smtpFrom = process.env.EMAIL_FROM || '"VolunteerHub" <no-reply@volunteerhub.com>';

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort || "587"),
        secure: smtpPort === "465",
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      const mailOptions = {
        from: smtpFrom,
        to: email,
        subject: "VolunteerHub - Password Reset Request",
        text: `You requested a password reset. Please click the link below to reset your password:\n\n${resetUrl}\n\nThis link is valid for 1 hour.`,
        html: `<p>You requested a password reset. Please click the link below to reset your password:</p>
               <p><a href="${resetUrl}">${resetUrl}</a></p>
               <p>This link is valid for 1 hour.</p>`
      };

      await transporter.sendMail(mailOptions);
      console.log(`[EMAIL SENT] Password reset email successfully sent to ${email}`);
    } catch (mailError) {
      console.error("[EMAIL ERROR] Failed to send email via Nodemailer:", mailError.message);
    }
  } else {
    console.log("[SMTP CONFIG] SMTP details not fully set up in .env. Skipping real email dispatch.");
  }

  return resetToken;
};

export const resetPassword = async ({ token, newPassword }) => {
  if (!token) {
    const err = new Error("Password reset token is required");
    err.statusCode = 400;
    throw err;
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find user with matching unexpired token
  const user = await User.findOne({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        [Op.gt]: Date.now()
      }
    }
  });

  if (!user) {
    const err = new Error("Invalid or expired password reset token");
    err.statusCode = 400;
    throw err;
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password and clear reset token fields
  await user.update({
    password: hashedPassword,
    resetPasswordToken: null,
    resetPasswordExpires: null
  });

  return true;
};
