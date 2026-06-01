import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sequelize from "../config/db.js";
import User from "../models/userModel.js";
import StudentProfile from "../models/studentProfileModel.js";
import OrganizerProfile from "../models/organizerProfileModel.js";

export const register = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { role, name, email, password, phone, clubName, contactNumber, studentId, faculty, skills, department } = req.body;

    // Check existing user
    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      await transaction.rollback();
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Resolve name and phone based on role/payload structure
    let finalName = name;
    let finalPhone = phone;

    if (role === "student") {
      finalName = name || req.body.fullName;
    } else if (role === "organizer") {
      finalName = clubName || req.body.organizationName || name;
      finalPhone = phone || contactNumber;
    }

    // Create User within transaction
    const user = await User.create({
      name: finalName,
      email,
      password: hashedPassword,
      phone: finalPhone,
      role,
      department,
    }, { transaction });

    let profile = null;

    if (role === "student") {
      profile = await StudentProfile.create({
        userId: user.id,
        studentId,
        faculty,
        skills,
      }, { transaction });
    } else if (role === "organizer") {
      profile = await OrganizerProfile.create({
        userId: user.id,
        organizationName: finalName,
      }, { transaction });
    }

    await transaction.commit();

    // Prepare response user object
    const userJson = user.toJSON();
    delete userJson.password;

    res.status(201).json({
      message: "User registered successfully",
      user: {
        ...userJson,
        studentProfile: role === "student" ? profile : null,
        organizerProfile: role === "organizer" ? profile : null,
      },
    });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user including profiles
    const user = await User.findOne({
      where: { email },
      include: [
        { model: StudentProfile, as: "studentProfile" },
        { model: OrganizerProfile, as: "organizerProfile" },
      ],
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }
    
    if (user.status === "suspended") {
      return res.status(403).json({
        message: "Your account has been suspended. Please contact administration.",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        studentProfile: user.studentProfile,
        organizerProfile: user.organizerProfile,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    // Find logged user including profiles
    const user = await User.findByPk(req.user.id, {
      attributes: {
        exclude: ["password"],
      },
      include: [
        { model: StudentProfile, as: "studentProfile" },
        { model: OrganizerProfile, as: "organizerProfile" },
      ],
    });

    // Check user exists
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Return user
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};