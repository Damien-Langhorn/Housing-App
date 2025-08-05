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
const PORT = process.env.PORT || 5000;

app.use(
  "/api/webhooks",
  express.raw({ type: "application/json" }),
  webhookRouter
);

app.use(
  cors({
    origin: ["http://localhost:3000", "https://your-frontend-domain.com"],
  })
);

app.use(express.json());
app.use("/api/houses", rateLimiter, houseRoutes);
app.use("/api/user", rateLimiter, userRoutes);

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Handle 404s
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on", PORT);
  });
});
