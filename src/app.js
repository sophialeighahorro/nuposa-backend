import express from "express";
import cors from "cors";
import catRoutes from "./routes/catRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import adoptionRoutes from "./routes/adoptionRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import connectDB from "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/cats", catRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/adoptions", adoptionRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  console.log("Browser route successful.");
  res.send(" HI MGA POSA");
});

export default app;
