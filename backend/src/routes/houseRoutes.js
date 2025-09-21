import express from "express";
import {
  createHouse,
  deleteHouse,
  getHouses,
  updateHouse,
  getHouseById,
} from "../controllers/houseControllers.js";
import { requireAuth } from "../middleware/clerk.js";
import { validateHouse } from "../middleware/validation.js";
import { uploadRateLimit } from "../middleware/rateLimiter.js";

const router = express.Router();

// ✅ SECURITY: Public routes (read-only)
router.get("/", getHouses);
router.get("/:id", getHouseById);

// ✅ SECURITY: Protected routes with validation and rate limiting
router.post("/", uploadRateLimit, requireAuth, validateHouse, createHouse);

router.put("/:id", uploadRateLimit, requireAuth, validateHouse, updateHouse);

router.delete("/:id", requireAuth, deleteHouse);

export default router;
