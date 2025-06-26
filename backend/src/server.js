import express from "express";
import houseRoutes from "./routes/houseRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import webhookRouter from "./routes/webhook.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on http://localhost:", PORT);
  });
});

// Middleware to parse JSON requests
app.use(
  cors({
    origin: "http://localhost:3001", // Adjust this to your frontend URL
  })
);
app.use(express.json());
app.use(rateLimiter);

app.use("/api/houses", houseRoutes);
app.use("/api/user", userRoutes);
app.use("https://fresh-bug-beloved.ngrok-free.app/api/", webhookRouter);
