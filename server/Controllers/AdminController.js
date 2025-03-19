import config from "../Config/config.js";
import nodemailer from "nodemailer";

export const adminLogin = (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    res.cookie("adminAuth", "authenticated", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 3600000,
    });
    return res.status(200).json({ message: "Login successful" });
  }

  return res.status(401).json({ message: "Invalid credentials" });
};

export const adminLogout = (req, res) => {
  res.clearCookie("adminAuth", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logout successful" });
};

export const adminProtected = (req, res) => {
  if (req.cookies.adminAuth === "authenticated") {
    return res.status(200).json({ message: "You are authenticated" });
  }
  return res.status(401).json({ message: "Unauthorized" });
};

export const forgotPassword = async (req, res) => {
  const { contact } = req.body;

  if (!contact) {
    return res
      .status(400)
      .json({ message: "Please provide email or phone number" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(contact)) {
    return res
      .status(400)
      .json({ message: "Please provide a valid email address" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: contact,
    subject: "Admin Password Reset Request",
    text: `Admin has requested password reset. Contact details: ${contact}\nCurrent credentials:\nUsername: ${process.env.ADMIN_USERNAME}\nPassword: ${process.env.ADMIN_PASSWORD}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      message:
        "Reset request sent successfully. Please check with support team.",
    });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: "Failed to send reset request" });
  }
};

export const updatePassword = (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!req.cookies.adminAuth || req.cookies.adminAuth !== "authenticated") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (oldPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Old password is incorrect" });
  }

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({
      message: "New password must be at least 8 characters long",
    });
  }

  process.env.ADMIN_PASSWORD = newPassword;

  res.clearCookie("adminAuth", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  return res.status(200).json({
    message: "Password updated successfully. Please login with new credentials",
  });
};
