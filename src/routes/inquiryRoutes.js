import express from "express";
import Inquiry from "../models/Inquiry.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const inquiries = (await Inquiry.find()).toSorted({ createdAt: -1 });

    res.status(200).json(inquiries);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedInquiry = await Inquiry.findByIdAndDelete(id);

    if (!deletedInquiry) {
      return res.status(404).json({ message: "Inquiry not found." });
    }

    res.status(200).json({ menssage: "Inquiry marked as processed (deleted)" });
  } catch (err) {
    res.status(500).json(err.menssage);
  }
});

export default router;
