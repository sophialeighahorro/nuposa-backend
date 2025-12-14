import express from "express";
import { requireAdmin } from "../middleware/auth.js";
import Cat from "../models/Cat.js";
import Adoption from "../models/Adoption.js";

const router = express.Router();

// Protect all admin routes
router.use(requireAdmin);

// Cats CRUD (admin-only)
router.get("/cats", async (req, res) => {
  try {
    const cats = await Cat.find();
    res.json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/cats", async (req, res) => {
  try {
    const { name, age, gender, isAdopted, desc } = req.body;
    const cat = new Cat({ name, age, gender, isAdopted, desc });
    const saved = await cat.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/cats/:id", async (req, res) => {
  try {
    const { name, age, gender, isAdopted, desc } = req.body;
    const cat = await Cat.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: "Cat not found" });
    if (name !== undefined) cat.name = name;
    if (age !== undefined) cat.age = age;
    if (gender !== undefined) cat.gender = gender;
    if (isAdopted !== undefined) cat.isAdopted = isAdopted;
    if (desc !== undefined) cat.desc = desc;
    const updated = await cat.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/cats/:id", async (req, res) => {
  try {
    const deleted = await Cat.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Cat not found" });
    res.json({ message: "Cat deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update adoption progress/status
router.get("/adoptions", async (req, res) => {
  try {
    const items = await Adoption.find().populate("chosenCat", "name");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/adoptions/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = [
      "Submitted",
      "Under Review",
      "Interview Scheduled",
      "Approved",
    ];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const adoption = await Adoption.findById(req.params.id);
    if (!adoption)
      return res.status(404).json({ message: "Adoption not found" });
    adoption.status = status;
    const updated = await adoption.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
