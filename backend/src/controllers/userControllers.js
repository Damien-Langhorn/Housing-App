import User from "../models/User.js";
import House from "../models/HouseListings.js";
import mongoose from "mongoose";

export async function getUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
    console.log("Fetched user by ID:", req.params.id);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
    console.error("Error fetching user:", error.message);
  }
}

export async function getUserHouses(req, res) {
  try {
    const clerkId = req.params.clerk_id;
    console.log("Fetching houses for user ID:", clerkId);
    // Validate userId
    if (!clerkId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const houses = await House.find({ clerk_id: clerkId });
    if (!houses || houses.length === 0) {
      return res.status(404).json({ message: "No houses found for this user" });
    }
    res.status(200).json(houses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user's houses", error: error.message });
    console.error("Error fetching user's houses:", error.message);
  }
}

export async function createUser(req, res) {
  try {
    const { username, email, clerk_id } = req.body;
    const newUser = new User({
      username,
      email,
      clerk_id,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
    console.error("Error creating user:", error.message);
  }
}

export async function updateUser(req, res) {
  try {
    const { username, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
    console.error("Error updating user:", error.message);
  }
}

export async function deleteUser(req, res) {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
    console.error("Error deleting user:", error.message);
  }
}
// This code defines the user controller functions for handling user-related operations
