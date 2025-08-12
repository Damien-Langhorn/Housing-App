import express from "express";
import { requireAuth } from "../middleware/clerk.js";
import {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  checkFavoriteStatus,
} from "../controllers/favoriteControllers.js";

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// POST /api/favorites - Add a house to favorites
router.post("/", addFavorite);

// DELETE /api/favorites/:house_id - Remove a house from favorites
router.delete("/:house_id", removeFavorite);

// GET /api/favorites - Get all user's favorites
router.get("/", getUserFavorites);

// POST /api/favorites/check - Check favorite status for multiple houses
router.post("/check", checkFavoriteStatus);

export default router;
