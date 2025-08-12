import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import House from "../models/HouseListings.js";

// Send a message
export async function sendMessage(req, res) {
  try {
    const { receiver_id, house_id, content, message_type } = req.body;
    const sender_id = req.user.clerk_id; // From auth middleware

    // Validate house exists
    const house = await House.findById(house_id);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    // Create message
    const message = new Message({
      sender_id,
      receiver_id,
      house_id,
      content,
      message_type,
    });

    await message.save();

    // Create or update conversation
    const participants = [sender_id, receiver_id].sort();
    let conversation = await Conversation.findOne({
      participants,
      house_id,
    });

    if (!conversation) {
      conversation = new Conversation({
        participants,
        house_id,
        last_message: message._id,
        last_message_time: new Date(),
      });
    } else {
      conversation.last_message = message._id;
      conversation.last_message_time = new Date();
    }

    await conversation.save();

    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res
      .status(500)
      .json({ message: "Error sending message", error: error.message });
  }
}

// Get messages for a conversation
export async function getMessages(req, res) {
  try {
    const { house_id, other_user_id } = req.params;
    const current_user_id = req.user.clerk_id;

    const messages = await Message.find({
      house_id,
      $or: [
        { sender_id: current_user_id, receiver_id: other_user_id },
        { sender_id: other_user_id, receiver_id: current_user_id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("house_id");

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res
      .status(500)
      .json({ message: "Error fetching messages", error: error.message });
  }
}

// Get user's conversations
export async function getUserConversations(req, res) {
  try {
    const user_id = req.user.clerk_id;

    const conversations = await Conversation.find({
      participants: user_id,
    })
      .populate({
        path: "house_id",
        select: "address city state price image", // Only get needed fields
      })
      .populate({
        path: "last_message",
        select: "content sender_id createdAt",
      })
      .sort({ last_message_time: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res
      .status(500)
      .json({ message: "Error fetching conversations", error: error.message });
  }
}

// Mark messages as read
export async function markAsRead(req, res) {
  try {
    const receiver_id = req.user.clerk_id; // Current user is the receiver
    const { house_id, sender_id } = req.body;

    // ✅ FIXED: Mark messages as read where current user is the receiver
    const result = await Message.updateMany(
      {
        house_id,
        sender_id, // Messages FROM this sender
        receiver_id, // TO the current user
        read: false,
      },
      { read: true }
    );

    res.status(200).json({
      message: "Messages marked as read",
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({
      message: "Error marking messages as read",
      error: error.message,
    });
  }
}

// Get unread message counts for each conversation
export async function getUnreadCounts(req, res) {
  try {
    const user_id = req.user.clerk_id;

    const conversations = await Conversation.find({
      participants: user_id,
    });

    const unreadCounts = {};

    for (const conversation of conversations) {
      const count = await Message.countDocuments({
        house_id: conversation.house_id,
        receiver_id: user_id, // Current user must be the receiver
        read: false,
      });
      unreadCounts[conversation._id] = count;
    }

    res.status(200).json(unreadCounts);
  } catch (error) {
    console.error("Error fetching unread counts:", error);
    res
      .status(500)
      .json({ message: "Error fetching unread counts", error: error.message });
  }
}
