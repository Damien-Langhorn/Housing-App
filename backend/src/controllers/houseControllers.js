import House from "../models/HouseListings.js";

export async function getHouses(_, res) {
  try {
    const houses = await House.find().sort({ createdAt: -1 }); // Sort by creation date, most recent first
    res.status(200).json(houses);
    console.log("Fetched all houses");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching houses", error: error.message });
    console.error("Error fetching houses:", error.message);
  }
}

export async function getHouseById(req, res) {
  try {
    const house = await House.findById(req.params.id);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }
    res.status(200).json(house);
    console.log("Fetched house by ID:", req.params.id);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching house", error: error.message });
    console.error("Error fetching house:", error.message);
  }
}

export async function createHouse(req, res) {
  try {
    console.log("Creating house with data:", req.body); // Add debug log

    const {
      address,
      city,
      state,
      postal_code,
      price,
      bedrooms,
      bathrooms,
      square_feet,
      year_built,
      image,
      clerk_id,
    } = req.body;

    const newHouse = new House({
      address,
      city,
      state,
      postal_code,
      price,
      bedrooms,
      bathrooms,
      square_feet,
      year_built,
      image,
      clerk_id,
    });

    await newHouse.save();
    console.log("House created successfully:", newHouse._id);

    res.status(201).json(newHouse);
  } catch (error) {
    console.error("Error creating house:", error.message);
    res
      .status(500)
      .json({ message: "Error creating house", error: error.message });
  }
}

export async function updateHouse(req, res) {
  try {
    const {
      address,
      city,
      state,
      postal_code,
      price,
      bedrooms,
      bathrooms,
      square_feet,
      year_built,
      image,
    } = req.body;
    const updatedHouse = await House.findByIdAndUpdate(
      req.params.id,
      {
        address,
        city,
        state,
        postal_code,
        price,
        bedrooms,
        bathrooms,
        square_feet,
        year_built,
        image,
      },
      { new: true }
    );

    if (!updatedHouse) {
      return res.status(404).json({ message: "House not found" });
    }
    res.status(200).json(updatedHouse);
  } catch (error) {
    console.error("Error updating house:", error.message);
    res
      .status(500)
      .json({ message: "Error updating house:", error: error.message });
  }
}

export async function deleteHouse(req, res) {
  try {
    const deletedHouse = await House.findByIdAndDelete(req.params.id);

    if (!deletedHouse) {
      return res.status(404).json({ message: "House not found" });
    }
    res.status(200).json({ message: "House deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting house", error: error.message });
    console.error("Error deleting house:", error.message);
  }
}
