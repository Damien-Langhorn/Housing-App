import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: String, // Clerk IDs
        required: true,
      },
    ],
    house_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "House",
    },
    last_message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    last_message_time: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Ensure unique conversations per house between two users
conversationSchema.index({ participants: 1, house_id: 1 }, { unique: true });

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
