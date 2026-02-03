import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet"; // 🛡️ Security Headers

// Import Routes
import catRoutes from "./routes/catRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import adoptionRoutes from "./routes/adoptionRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Import Database & Error Tools
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";
import logger from "./config/logger.js";

dotenv.config();

const app = express();

// ==========================================
// 🛡️ SECURITY & CONFIGURATION
// ==========================================

// 1. HELMET: Secure HTTP Headers
// 1. HELMET: Secure HTTP Headers
// We disable 'crossOriginResourcePolicy' so the Frontend can fetch data
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
// 2. CORS: Allow browser requests
app.use(cors());

// 3. BODY PARSER: Read JSON inputs
app.use(express.json());

// 4. MANUAL MONGO SANITIZE (The Fix)
// Replaces the broken library. Removes '$' and '.' from inputs to prevent Injection.
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (obj instanceof Object) {
      for (const key in obj) {
        if (/^\$/.test(key) || key.includes('.')) {
          // Delete dangerous keys (starting with $ or containing .)
          delete obj[key];
        } else {
          sanitize(obj[key]); // Recursively clean nested objects
        }
      }
    }
  };
  
  // Clean all input locations
  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  
  next();
});

// ==========================================
// 🔌 DATABASE & ROUTES
// ==========================================
connectDB();

app.use("/api/cats", catRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/adoptions", adoptionRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminRoutes);

// Base Route
app.get("/", (req, res) => {
  console.log("Browser route successful.");
  res.send("HI MGA POSA (Secure Mode + Manual Sanitize 🛡️)");
});

// Test Route for Logging
app.get("/error-test", (req, res, next) => {
  const error = new Error("Simulated System Crash for Testing!");
  next(error); 
});

// Global Error Handler (Must be last)
app.use(errorHandler);

export default app;