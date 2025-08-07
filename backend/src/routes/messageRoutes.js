import express from "express";
import {
  sendMessage,
  getMessages,
  getUserConversations,
  markAsRead,
} from "../controllers/messageControllers.js";
import { requireAuth } from "../middleware/clerk.js";

const router = express.Router();

router.post("/", requireAuth, sendMessage);
router.get("/conversations", requireAuth, getUserConversations);
router.get("/:house_id/:other_user_id", requireAuth, getMessages);
router.patch("/read", requireAuth, markAsRead);

export default router;
