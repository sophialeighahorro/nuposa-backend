import express from "express";
import Cat from "../models/Cat.js";
import upload from "../config/multerConfig.js";
import fs from "fs";
// SECURITY: Import the middleware to check for the Admin Token
import { requireAdmin } from "../middleware/auth.js"; 

const router = express.Router();

// ==========================================
// PUBLIC ROUTES (Everyone can see cats)
// ==========================================

// READ ALL
router.get("/", async (req, res) => {
  try {
    const cats = await Cat.find();
    res.status(200).json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ ONE
router.get("/:id", async (req, res) => {
  try {
    const cat = await Cat.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: "Cat not found" });
    res.status(200).json(cat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// PROTECTED ROUTES (Only Admin can modify)
// Checklist: "Restrict access to protected URLs to only authorized users"
// ==========================================

// CREATE (Added requireAdmin)
router.post("/", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, age, isAdopted, desc } = req.body;

    const newCat = new Cat({
      name,
      age,
      isAdopted,
      desc,
    });

    if (req.file) {
      newCat.image.data = fs.readFileSync(req.file.path);
      newCat.image.contentType = req.file.mimetype;
    }

    const savedCat = await newCat.save();

    if (req.file) fs.unlinkSync(req.file.path);
    res.status(201).json(savedCat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE (Added requireAdmin)
router.put("/:id", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, age, isAdopted, desc } = req.body;

    let cat = await Cat.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: "Cat not found" });

    if (name) cat.name = name;
    if (age) cat.age = age;
    if (isAdopted !== undefined) cat.isAdopted = isAdopted;
    if (desc) cat.desc = desc;

    if (req.file) {
      cat.image.data = fs.readFileSync(req.file.path);
      cat.image.contentType = req.file.mimetype;
      fs.unlinkSync(req.file.path);
    }

    const updatedCat = await cat.save();
    res.status(200).json(updatedCat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE (Added requireAdmin)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const deletedCat = await Cat.findByIdAndDelete(req.params.id);

    if (!deletedCat) return res.status(404).json({ message: "Cat not found" });

    res.status(200).json({ message: "Cat deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;