import express from "express";
import {
  createUser,
  deleteUser,
  updateUser,
  getUser,
  getUserHouses,
} from "../controllers/userControllers.js";

const router = express.Router();

// Define routes for users
router.get("/:id", getUser);
router.get("/:clerk_id/houses", getUserHouses); // Fetch houses for a specific user
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
// Export the router to be used in the main app
// This file defines the routes for user-related operations
