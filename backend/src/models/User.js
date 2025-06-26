import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hash in production!
  email: { type: String, required: true, unique: true },
  clerk_id: { type: String, required: true, unique: true }, // Clerk user ID
});

const User = mongoose.model("User", userSchema);

export default User;
