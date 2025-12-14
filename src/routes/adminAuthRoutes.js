import express from "express";
import { issueAdminToken } from "../middleware/auth.js";

const router = express.Router();

// POST /api/admin/auth/login
router.post("/login", (req, res) => {
  const { username, password } = req.body || {};

  const ADMIN_USER = process.env.ADMIN_USER || "admin";
  const ADMIN_PASS = process.env.ADMIN_PASS || "admin123";

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = issueAdminToken();
    return res.status(200).json({ token });
  }
  return res.status(401).json({ message: "Invalid credentials" });
});

export default router;
