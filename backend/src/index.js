import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import paperRouter from "./routes/paper.route.js";
import analyticsRouter from "./routes/analytics.route.js";
dotenv.config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://research-paper-reading-tracker-fawn.vercel.app/"
  ]
}));
app.use(express.json());

app.use("/api/papers", paperRouter);
app.use("/api/analytics", analyticsRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});