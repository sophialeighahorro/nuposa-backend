import express from "express";
import bcrypt from "bcryptjs"; // SECURITY: For comparing hashes
import rateLimit from "express-rate-limit"; // SECURITY: For blocking brute force
import Admin from "../models/Admin.js"; // Import your Model
import { issueAdminToken } from "../middleware/auth.js";

const router = express.Router();

// SECURITY: Brute Force Protection
// "Enforce account disabling after an established number of invalid login attempts"
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per window
  message: { message: "Too many login attempts, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/admin/auth/login
// Apply the limiter middleware only to this route
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body || {};

    // 1. Validate Input
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // 2. Find the Admin in DB
    const admin = await Admin.findOne({ username });

    // 3. Check Password (Secure Comparison)
    // "Authentication failure responses should not indicate which part was incorrect"
    // If admin is not found, we still say "Invalid credentials"
    const isMatch = admin ? await bcrypt.compare(password, admin.password) : false;

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4. Success
    const token = issueAdminToken();
    return res.status(200).json({ token });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;