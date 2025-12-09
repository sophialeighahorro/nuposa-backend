import express from "express";
import Cat from "../models/Cat.js";
import upload from "../config/multerConfig.js";
import fs from "fs";
const router = express.Router();

// READ
router.get("/", async (req, res) => {
  try {
    const cats = await Cat.find();
    res.status(200).json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE
router.post("/", upload.single("image"), async (req, res) => {
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

// get specific cat
router.get("/:id", async (req, res) => {
  try {
    const cat = await Cat.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: "Cat not found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, age, isAdopted, desc } = req.body;

    // Find existing cat first
    let cat = await Cat.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: "Cat not found" });

    // Update text fields if they are provided
    if (name) cat.name = name;
    if (age) cat.age = age;
    if (isAdopted !== undefined) cat.isAdopted = isAdopted;
    if (desc) cat.desc = desc;

    // Update Image ONLY if a new file is uploaded
    if (req.file) {
      cat.image.data = fs.readFileSync(req.file.path);
      cat.image.contentType = req.file.mimetype;
      fs.unlinkSync(req.file.path); // Cleanup
    }

    const updatedCat = await cat.save();
    res.status(200).json(updatedCat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deletedCat = await Cat.findByIdAndDelete(req.params.id);

    if (!deletedCat) return res.status(404).json({ message: "Cat not found" });

    res.status(200).json({ message: "Cat deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
