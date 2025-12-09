import express from "express";
import Volunteer from "../models/Volunteer.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const volunteers = (await Volunteer.find()).toSorted({ createdAt: -1 });
    res.status(200).json(volunteers);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedVolunteers = await Volunteer.findByIdAndDelete(id);

    if (!deletedVolunteers) {
      res.status(404).json({ message: "Volunteer submission not found." });
    }
    res
      .status(200)
      .json({ message: "Volunteer submission marked as processed (deleted)" });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

export default router;
