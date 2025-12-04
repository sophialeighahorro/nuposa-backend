import express from "express";
import Cat from "../models/Cat.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cats = await Cat.find();
    res.status(200).json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

