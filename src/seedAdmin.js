// src/seedAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js"; // Make sure you created this Model in the previous step!

dotenv.config();

// UPDATE THIS with your actual connection string from .env or hardcode it temporarily
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/nuposa"; 

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB...");

    // 1. Check if admin exists
    const existingAdmin = await Admin.findOne({ username: "admin" });
    if (existingAdmin) {
      console.log("Admin already exists!");
      process.exit();
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    // 3. Create the user
    const newAdmin = new Admin({
      username: "admin",
      password: hashedPassword, // Storing the HASH, not "admin123"
    });

    await newAdmin.save();
    console.log("SUCCESS: Admin created with hashed password!");
    process.exit();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

seedAdmin();