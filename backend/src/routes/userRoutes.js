import express from "express";
import {
  createUser,
  deleteUser,
  updateUser,
  getUser,
  getUserHouses,
  getUserByClerkId,
  getUsersByClerkIds,
} from "../controllers/userControllers.js";

const router = express.Router();

// Define routes for users
router.get("/:clerk_id", getUser);
router.get("/:clerk_id/houses", getUserHouses);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/clerk/:clerkId", getUserByClerkId);
router.post("/clerk/batch", getUsersByClerkIds);

export default router;
// Export the router to be used in the main app
// This file defines the routes for user-related operations
