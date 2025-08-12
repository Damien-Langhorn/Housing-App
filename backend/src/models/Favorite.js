import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema(
  {
    clerk_id: {
      type: String,
      required: true,
      index: true, // For faster queries
    },
    house_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "House",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can't favorite the same house twice
FavoriteSchema.index({ clerk_id: 1, house_id: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", FavoriteSchema);
export default Favorite;
