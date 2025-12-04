import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  console.log("Browser route successful.");
  res.send(" HI MGA POSA");
});

export default app;
