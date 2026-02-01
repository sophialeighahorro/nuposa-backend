import express from "express";
import bcrypt from "bcryptjs"; 
import rateLimit from "express-rate-limit"; 
import Admin from "../models/Admin.js"; 
import { issueAdminToken } from "../middleware/auth.js";
import logger from "../config/logger.js"; // ✅ Imported

const router = express.Router();

// SECURITY: Brute Force Protection
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: { message: "Too many login attempts, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
  // NEW: Log when someone gets blocked by the rate limiter
  handler: (req, res, next, options) => {
    logger.warn(`Brute force blocked: IP ${req.ip} exceeded login limits.`);
    res.status(options.statusCode).send(options.message);
  }
});

// POST /api/admin/auth/login
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
    const isMatch = admin ? await bcrypt.compare(password, admin.password) : false;

    if (!isMatch) {
      // ✅ SECURITY LOG: Log the failure (Requirement: "Log all authentication attempts, especially failures")
      logger.warn(`Failed login attempt for username: ${username} from IP: ${req.ip}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4. Success
    // ✅ SECURITY LOG: Log the success
    logger.info(`Successful login for admin: ${username}`);
    
    const token = issueAdminToken();
    return res.status(200).json({ token });

  } catch (error) {
    // ✅ SECURITY LOG: Use logger instead of console.error
    logger.error(`System error during login: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;