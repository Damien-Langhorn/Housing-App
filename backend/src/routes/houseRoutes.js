import express from "express";
import {
  createHouse,
  deleteHouse,
  getHouses,
  updateHouse,
  getHouseById,
} from "../controllers/houseControllers.js";
import { requireAuth } from "../middleware/clerk.js";

const router = express.Router();

// Define routes for notes

router.get("/", getHouses);
router.get("/:id", getHouseById); // Assuming you want to fetch a specific house by ID
router.post("/", requireAuth, createHouse);
router.put("/:id", requireAuth, updateHouse);
router.delete("/:id", requireAuth, deleteHouse);

export default router;
