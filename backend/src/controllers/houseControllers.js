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

export async function createHouse(_, res) {
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
      image_url,
      userId,
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
      image_url,
      user: userId, // Assuming userId is passed in the request body
    });
    await newHouse.save();
    res
      .status(201)
      .json({ message: "House created successfully", house: newHouse });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating house", error: error.message });
    console.error("Error creating houses:", error.message);
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
      image_url,
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
        image_url,
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
    // Optionally, you can also delete the image from the file system if needed
    await fs.unlink(deletedHouse.image_url); // Uncomment if you want to delete the image file
    res.status(200).json({ message: "House deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting house", error: error.message });
    console.error("Error deleting house:", error.message);
  }
}
