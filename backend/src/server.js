import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import xss from "xss";

// ✅ Import routes
import houseRoutes from "./routes/houseRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import webhookRouter from "./routes/webhook.js";

// ✅ Import database config
import { connectDB } from "./config/db.js";

// ✅ Import security middleware
import { setupSecurity, enforceHTTPS } from "./middleware/security.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import {
  globalRateLimit,
  authRateLimit,
  apiRateLimit,
  uploadRateLimit,
} from "./middleware/rateLimiter.js";

// ✅ Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ SECURITY: Trust proxy for correct IP detection
app.set("trust proxy", 1);

// ✅ SECURITY: HTTPS enforcement in production
if (process.env.NODE_ENV === "production") {
  app.use(enforceHTTPS);
}

// ✅ SECURITY: Setup comprehensive security middleware
setupSecurity(app);

// ✅ SECURITY: Global rate limiting
app.use(globalRateLimit);

// ✅ SECURITY: Enhanced CORS configuration
// Include local development, configured frontend URL, and deployed Vercel domain
const allowedOrigins = [
  "http://localhost:3000",
  "https://localhost:3000",
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
  "https://dreamhomesllc.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // ✅ Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) {
        return callback(null, true);
      }

      // ✅ In development, allow any localhost origin (e.g. different ports)
      if (
        process.env.NODE_ENV !== "production" &&
        (origin.startsWith("http://localhost") ||
          origin.startsWith("https://localhost"))
      ) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn("Blocked CORS origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    maxAge: 86400, // 24 hours
  }),
);

// ✅ SECURITY: Raw body parser for webhooks (before express.json)
app.use(
  "/api/webhooks",
  express.raw({ type: "application/json", limit: "1mb" }),
  authRateLimit,
  webhookRouter,
);

// ✅ SECURITY: JSON body parser with size limit
app.use(
  express.json({
    limit: "10mb",
    type: "application/json",
  }),
);

// ✅ SECURITY: URL-encoded parser with size limit
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);

// ✅ SECURITY: Apply rate limiting to routes
app.use("/api/houses", apiRateLimit, houseRoutes);
app.use("/api/users", apiRateLimit, userRoutes);
app.use("/api/messages", apiRateLimit, messageRoutes);
app.use("/api/favorites", apiRateLimit, favoriteRoutes);

// ✅ Health check endpoint (no rate limiting)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ✅ SECURITY: Error handling middleware
app.use(errorHandler);

// ✅ SECURITY: 404 handler
app.use(notFoundHandler);

// ✅ Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  process.exit(0);
});

// ✅ Start server with error handling
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔒 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🌐 CORS origins: ${allowedOrigins.join(", ")}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  });
