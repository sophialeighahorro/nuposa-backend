import express from "express";
import cors from "cors";
import dotenv from "dotenv"; // NEW: For secure environment variables
import mongoSanitize from "express-mongo-sanitize"; // NEW: For preventing NoSQL injection

// Import Routes
import catRoutes from "./routes/catRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import adoptionRoutes from "./routes/adoptionRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Import Database & Error Handling Tools
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js"; // NEW: The generic error handler
import logger from "./config/logger.js"; // NEW: The Winston logger

// Load environment variables immediately
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// SECURITY: Sanitize data to prevent NoSQL Injection (removes $ and . from inputs)
// Checklist: "Controls for hazardous characters"
app.use(mongoSanitize());

// Connect to Database
connectDB();

// Routes
app.use("/api/cats", catRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/adoptions", adoptionRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminRoutes);

// Base Route
app.get("/", (req, res) => {
  console.log("Browser route successful.");
  res.send("HI MGA POSA (Secure Mode)");
});

// NEW: Test Route for Logging
// Use this to prove to your professor that logging works!
app.get("/error-test", (req, res, next) => {
  const error = new Error("Simulated System Crash for Testing!");
  next(error); 
});

// NEW: Global Error Handler
// Checklist: "Use error handlers that do not display debugging info"
// IMPORTANT: This must be the very last app.use()
app.use(errorHandler);

export default app;