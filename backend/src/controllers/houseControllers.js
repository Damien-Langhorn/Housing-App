import House from "../models/HouseListings.js";
import xss from "xss";

// ✅ SECURITY: Sanitize HTML content
const sanitizeInput = (input) => {
  if (typeof input === "string") {
    return xss(input.trim());
  }
  return input;
};

export async function getHouses(req, res) {
  try {
    // ✅ Add pagination for large datasets
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const houses = await House.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // ✅ Better performance

    const total = await House.countDocuments();

    res.status(200).json({
      success: true,
      data: houses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching houses:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching houses",
    });
  }
}

export async function getHouseById(req, res) {
  try {
    // ✅ SECURITY: Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid house ID format",
      });
    }

    const house = await House.findById(req.params.id).lean();
    if (!house) {
      return res.status(404).json({
        success: false,
        message: "House not found",
      });
    }

    res.status(200).json({
      success: true,
      data: house,
    });
  } catch (error) {
    console.error("Error fetching house:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching house",
    });
  }
}

export async function createHouse(req, res) {
  try {
    // ✅ SECURITY: Sanitize all string inputs
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

    // ✅ SECURITY: Validate required fields
    if (!address || !city || !state || !price || !clerk_id) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: address, city, state, price, clerk_id",
      });
    }

    // ✅ SECURITY: Sanitize inputs
    const sanitizedData = {
      address: sanitizeInput(address),
      city: sanitizeInput(city),
      state: sanitizeInput(state),
      postal_code: postal_code ? sanitizeInput(postal_code) : undefined,
      price: parseFloat(price),
      bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
      bathrooms: bathrooms ? parseFloat(bathrooms) : undefined,
      square_feet: square_feet ? parseInt(square_feet) : undefined,
      year_built: year_built ? parseInt(year_built) : undefined,
      image: image ? sanitizeInput(image) : undefined,
      clerk_id: sanitizeInput(clerk_id),
    };

    // ✅ SECURITY: Validate data types and ranges
    if (isNaN(sanitizedData.price) || sanitizedData.price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number",
      });
    }

    if (
      sanitizedData.year_built &&
      (sanitizedData.year_built < 1800 ||
        sanitizedData.year_built > new Date().getFullYear())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid year built",
      });
    }

    const newHouse = new House(sanitizedData);
    await newHouse.save();

    res.status(201).json({
      success: true,
      data: newHouse,
      message: "House created successfully",
    });
  } catch (error) {
    console.error("Error creating house:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((e) => e.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating house",
    });
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
