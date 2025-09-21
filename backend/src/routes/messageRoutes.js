import express from "express";
import {
  sendMessage,
  getMessages,
  getUserConversations,
  markAsRead,
  getUnreadCounts,
} from "../controllers/messageControllers.js";
import { requireAuth } from "../middleware/clerk.js";
import { validateMessage } from "../middleware/validation.js";

const router = express.Router();

// ✅ SECURITY: All message routes require authentication and validation
router.post("/", requireAuth, validateMessage, sendMessage);

router.get("/conversations", requireAuth, getUserConversations);

router.get("/unread-counts", requireAuth, getUnreadCounts);
router.get("/:house_id/:other_user_id", requireAuth, getMessages);
router.patch("/read", requireAuth, markAsRead);

export default router;
