import express from "express";
import cors from "cors";
import catController from "./controller/catController.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/cats", catController);

app.get("/", (req, res) => {
  console.log("Browser route successful.");
  res.send(" HI MGA POSA");
});

export default app;
