import jwt from "jsonwebtoken";

export function requireAdmin(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Missing token" });

    const secret = process.env.JWT_SECRET || "dev-secret";
    const payload = jwt.verify(token, secret);
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
  const secret = process.env.JWT_SECRET || "dev-secret";
  const payload = { role: "admin" };
  return jwt.sign(payload, secret, { expiresIn: "8h" });
}
