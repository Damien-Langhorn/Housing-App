import mongoose from "mongoose";

const houseSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    postal_code: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    square_feet: {
      type: Number,
      required: true,
    },
    year_built: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    clerk_id: {
      type: String,
      required: true,
      ref: "User", // Reference to the User model
    },
  },
  { timestamps: true }
);

const House = mongoose.model("House", houseSchema);

export default House;
// This code defines a Mongoose schema and model for house listings in a real estate application.
