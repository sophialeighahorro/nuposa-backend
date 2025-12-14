import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../src/config/db.js";
import Cat from "../src/models/Cat.js";

async function run() {
  try {
    await connectDB();
    const count = await Cat.countDocuments();
    if (count > 0) {
      console.log(`Cats already present: ${count}. Skipping seeding.`);
      process.exit(0);
    }

    const cats = [
      {
        name: "Kali",
        age: 2,
        gender: "Female",
        isAdopted: false,
        desc: "Campus ginger mix",
      },
      {
        name: "Jebi",
        age: 3,
        gender: "Male",
        isAdopted: false,
        desc: "Tabby mix",
      },
      {
        name: "Araw",
        age: 1,
        gender: "Female",
        isAdopted: false,
        desc: "Calico mix",
      },
      {
        name: "Garden",
        age: 4,
        gender: "Male",
        isAdopted: false,
        desc: "Bicolor mix",
      },
    ];

    const created = await Cat.insertMany(cats);
    console.log(`Seeded ${created.length} cats.`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

run();
