import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender_id: {
      type: String, //Clerk ID
      required: true,
    },
    receiver_id: {
      type: String, //Clerk ID
      required: true,
    },
    house_id: {
      type: String, //House ID
      required: true,
      ref: "House",
    },
    content: {
      type: String,
      required: true,
      maxLenghth: 1000,
    },
    read: {
      type: Boolean,
      default: false,
    },
    message_type: {
      type: String,
      enum: ["inquiry", "response", "general"],
      default: "inquiry",
    },
  },
  { timestamps: true }
);

//Index for efficient queries
messageSchema.index({ sender_id: 1, receiver_id: 1, house_id: 1 });
messageSchema.index({ createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;
