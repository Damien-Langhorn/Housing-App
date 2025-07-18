import express from "express";
import houseRoutes from "./routes/houseRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import webhookRouter from "./routes/webhook.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";
import multer from "multer";

// Initialize multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Directory to save uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Append timestamp to the original filename
  },
});
export const upload = multer({ storage: storage });

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on ", PORT);
  });
});

app.use("/api", webhookRouter);

// Middleware to parse JSON requests
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust this to your frontend URL
  })
);

app.use(express.json());
app.use(rateLimiter);
app.use("/api/houses", houseRoutes);
app.use("/api/user", userRoutes);
