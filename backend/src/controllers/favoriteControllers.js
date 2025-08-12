import Favorite from "../models/Favorite.js";
import House from "../models/HouseListings.js";

// Add a house to favorites
export async function addFavorite(req, res) {
  try {
    const { house_id } = req.body;
    const clerk_id = req.user.clerk_id;

    console.log("=== Adding favorite:", { clerk_id, house_id });

    if (!house_id) {
      return res.status(400).json({ message: "House ID is required" });
    }

    // Check if house exists
    const house = await House.findById(house_id);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({ clerk_id, house_id });
    if (existingFavorite) {
      return res.status(400).json({ message: "House already favorited" });
    }

    // Create new favorite
    const favorite = new Favorite({ clerk_id, house_id });
    await favorite.save();

    console.log("=== Favorite added successfully:", favorite._id);

    res.status(201).json({
      message: "House added to favorites",
      favorite: favorite._id,
    });
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({
      message: "Error adding favorite",
      error: error.message,
    });
  }
}

// Remove a house from favorites
export async function removeFavorite(req, res) {
  try {
    const { house_id } = req.params;
    const clerk_id = req.user.clerk_id;

    console.log("=== Removing favorite:", { clerk_id, house_id });

    const deleted = await Favorite.findOneAndDelete({ clerk_id, house_id });

    if (!deleted) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    console.log("=== Favorite removed successfully");

    res.status(200).json({ message: "House removed from favorites" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({
      message: "Error removing favorite",
      error: error.message,
    });
  }
}

// Get all favorites for a user
export async function getUserFavorites(req, res) {
  try {
    const clerk_id = req.user.clerk_id;

    console.log("=== Fetching favorites for user:", clerk_id);

    const favorites = await Favorite.find({ clerk_id })
      .populate({
        path: "house_id",
        select:
          "address city state price image bedrooms bathrooms square_feet year_built postal_code createdAt clerk_id",
      })
      .sort({ createdAt: -1 }); // Most recent first

    // Filter out any favorites where the house was deleted
    const validFavorites = favorites.filter((fav) => fav.house_id);

    console.log("=== Found favorites:", validFavorites.length);

    res.status(200).json(validFavorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({
      message: "Error fetching favorites",
      error: error.message,
    });
  }
}

// Check if specific houses are favorited (for bulk checking)
export async function checkFavoriteStatus(req, res) {
  try {
    const { house_ids } = req.body; // Array of house IDs
    const clerk_id = req.user.clerk_id;

    if (!Array.isArray(house_ids)) {
      return res.status(400).json({ message: "house_ids must be an array" });
    }

    console.log("=== Checking favorite status for houses:", house_ids.length);

    const favorites = await Favorite.find({
      clerk_id,
      house_id: { $in: house_ids },
    });

    // Create a map of house_id -> true for favorited houses
    const favoriteMap = {};
    favorites.forEach((fav) => {
      favoriteMap[fav.house_id.toString()] = true;
    });

    console.log(
      "=== Favorite status checked:",
      Object.keys(favoriteMap).length,
      "favorited"
    );

    res.status(200).json(favoriteMap);
  } catch (error) {
    console.error("Error checking favorite status:", error);
    res.status(500).json({
      message: "Error checking favorite status",
      error: error.message,
    });
  }
}
