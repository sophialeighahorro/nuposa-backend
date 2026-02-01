import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// SECURITY: Crash if the secret is missing. 
// This ensures we NEVER use a weak default like "secret123".
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env");
  process.exit(1);
}

export function requireAdmin(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    
    if (!token) return res.status(401).json({ message: "Missing token" });

    // Use the secure env variable ONLY
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    if (payload?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function issueAdminToken() {
  const payload = { role: "admin" };
  // Use the secure env variable ONLY
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });
}