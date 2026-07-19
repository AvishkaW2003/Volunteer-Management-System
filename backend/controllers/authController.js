import * as authService from "../services/authService.js";

export const registerStudent = async (req, res, next) => {
  try {
    const student = await authService.registerStudent(req.body);
    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      user: student
    });
  } catch (error) {
    next(error);
  }
};

export const registerOrganizer = async (req, res, next) => {
  try {
    const organizer = await authService.registerOrganizer(req.body);
    res.status(201).json({
      success: true,
      message: "Organizer registered successfully",
      user: organizer
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const data = await authService.loginUser({ email, password });
    res.status(200).json({
      success: true,
      message: "Login successful",
      token: data.token,
      user: {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        studentProfile: data.user.studentProfile,
        organizerProfile: data.user.organizerProfile
      }
    });
  } catch (error) {
    // If invalid credentials, make sure status is 400
    if (error.message === "Invalid email or password") {
      error.statusCode = 400;
    }
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    // req.user is populated by authMiddleware.js
    const userId = req.user.id;
    const user = await authService.getUserIdentity(userId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const resetToken = await authService.forgotPassword(email);
    res.status(200).json({
      success: true,
      message: "If an account exists, a password reset email has been sent.",
      token: resetToken // Returning token for test/verification convenience
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: "Token and newPassword are required" });
    }

    await authService.resetPassword({ token, newPassword });
    res.status(200).json({
      success: true,
      message: "Password has been reset successfully"
    });
  } catch (error) {
    next(error);
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ success: false, message: "ID Token is required" });
    }

    const data = await authService.googleLoginUser(idToken);
    res.status(200).json({
      success: true,
      message: "Google login successful",
      token: data.token,
      user: {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        studentProfile: data.user.studentProfile
      }
    });
  } catch (error) {
    next(error);
  }
};