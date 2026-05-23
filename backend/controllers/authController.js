import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/UserModel.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check existing user
    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user    const user = await User.findOne
    const user = await User.findOne({
      where: { email },
    });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
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

    // Find logged user
    const user = await User.findByPk(req.user.id, {
      attributes: {
        exclude: ["password"],
      },
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