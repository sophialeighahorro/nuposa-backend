import express from "express";
import cors from "cors";
import dotenv from "dotenv"; 
import mongoSanitize from "express-mongo-sanitize"; 
import helmet from "helmet"; // NEW: Fixes OWASP Header Vulnerabilities

// Import Routes
import catRoutes from "./routes/catRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import adoptionRoutes from "./routes/adoptionRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Import Database & Error Handling Tools
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js"; 
import logger from "./config/logger.js"; 

// Load environment variables immediately
dotenv.config();

const app = express();

// ==========================================
// SECURITY MIDDLEWARE LAYER
// ==========================================

// 1. HELMET: Sets HTTP headers to stop Clickjacking, XSS, and Sniffing
// Checklist: "Missing Anti-clickjacking Header", "CSP Header Not Set", "X-Content-Type-Options Missing"
app.use(helmet());

// 2. CORS: Allow cross-origin requests (Configure strictly for production!)
app.use(cors());

// 3. BODY PARSER: Parse incoming JSON
app.use(express.json());

// 4. MONGO SANITIZE: Prevent NoSQL Injection (removes $ and . from inputs)
// Checklist: "Controls for hazardous characters"
app.use(mongoSanitize());

// ==========================================
// CONNECT DATABASE
// ==========================================
connectDB();

// ==========================================
// ROUTES
// ==========================================
app.use("/api/cats", catRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/adoptions", adoptionRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminRoutes);

// Base Route
app.get("/", (req, res) => {
  console.log("Browser route successful.");
  res.send("HI MGA POSA (Secure Mode + Helmet Enabled 🪖)");
});

// Test Route for Logging
app.get("/error-test", (req, res, next) => {
  const error = new Error("Simulated System Crash for Testing!");
  next(error); 
});

// ==========================================
// ERROR HANDLING (Must be last)
// ==========================================
// Checklist: "Use error handlers that do not display debugging info"
app.use(errorHandler);

export default app;