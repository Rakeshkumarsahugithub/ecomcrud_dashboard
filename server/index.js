import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config.js";
import User from "./User.js";
import Product from "./Products.js";

// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local development URL
      "https://ecomcrud-dashboard-1.onrender.com", // Production frontend URL
    ],
    credentials: true,
  })
);

// Database Connection
connectDB().catch((err) => {
  console.error("Database connection failed:", err.message);
  process.exit(1);
});

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.KEY);
    req.user = decoded; // Attach user info to the request object
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Routes

// Signup Route
app.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// Login Route
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.KEY, { expiresIn: "2h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7200000, // 2 hours
    });
    res.json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Logout Route
app.post("/auth/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production" });
  res.json({ message: "Logged out successfully" });
});

// Authentication Check Route
app.get("/auth/check", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ isAuthenticated: false });
  }

  try {
    jwt.verify(token, process.env.KEY);
    return res.json({ isAuthenticated: true });
  } catch {
    return res.json({ isAuthenticated: false });
  }
});

// Get User Info Route
app.get("/user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ name: user.name });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
