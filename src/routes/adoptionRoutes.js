import express from "express";
import Adoption from "../models/Adoption.js";

const router = express.Router();

// Create adoption application
router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      email,
      idNumber,
      contact,
      affiliation,
      chosenCat,
      petsAtHome,
      careEnvironment,
      reason,
      consent,
    } = req.body;

    if (!consent) {
      return res.status(400).json({ message: "Consent is required." });
    }

    const adoption = new Adoption({
      fullName,
      email,
      idNumber,
      contact,
      affiliation,
      chosenCat,
      petsAtHome,
      careEnvironment,
      reason,
      consent,
    });

    const saved = await adoption.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get adoption by id (for tracking)
router.get("/:id", async (req, res) => {
  try {
    const adoption = await Adoption.findById(req.params.id).populate(
      "chosenCat",
      "name"
    );
    if (!adoption)
      return res.status(404).json({ message: "Adoption not found" });
    res.status(200).json(adoption);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
