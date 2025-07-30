import mongoose from "mongoose";

const houseSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
      unique: true, // Ensure each house has a unique ID
    },
    house_id: {
      type: Number,
      auto: true,
      unique: true, // Ensure each house has a unique ID
    },
    address: {
      type: String,
      //required: true,
    },
    city: {
      type: String,
      //required: true,
    },
    state: {
      type: String,
      //required: true,
    },
    postal_code: {
      type: Number,
      //required: true,
    },
    price: {
      type: Number,
      //required: true,
    },
    bedrooms: {
      type: Number,
      //required: true,
    },
    bathrooms: {
      type: Number,
      //required: true,
    },
    square_feet: {
      type: Number,
      //required: true,
    },
    year_built: {
      type: Number,
      //required: true,
    },
    image_url: {
      type: String,
      //required: true,
    },
    clerk_id: {
      type: String,
      //required: true,
      unique: true, // Assuming this is the Clerk user ID
      ref: "User", // Reference to the User model
    },
  },
  { timestamps: true }
);

const House = mongoose.model("House", houseSchema);

export default House;
// This code defines a Mongoose schema and model for house listings in a real estate application.
