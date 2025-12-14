import express from "express";
import Volunteer from "../models/Volunteer.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.status(200).json(volunteers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      userName,
      courseAndSection,
      nuEmail,
      hasCatFood,
      catFoodName,
      selectedSlot,
    } = req.body;

    const volunteer = new Volunteer({
      userName,
      courseAndSection,
      nuEmail,
      hasCatFood,
      catFoodName: hasCatFood ? catFoodName : undefined,
      selectedSlot,
    });

    const saved = await volunteer.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedVolunteers = await Volunteer.findByIdAndDelete(id);

    if (!deletedVolunteers) {
      return res
        .status(404)
        .json({ message: "Volunteer submission not found." });
    }
    res
      .status(200)
      .json({ message: "Volunteer submission marked as processed (deleted)" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
