import express from "express";
import {
  createHouse,
  deleteHouse,
  getHouses,
  updateHouse,
  getHouseById,
} from "../controllers/houseControllers.js";
import { requireAuth } from "../middleware/clerk.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Set the destination for uploaded files

// Define routes for notes

router.get("/", getHouses);
router.get("/:id", getHouseById); // Assuming you want to fetch a specific house by ID
router.post(
  "/",
  requireAuth,
  createHouse,
  upload.single("image"),
  (req, res) => {
    // Handle the file upload and create house logic
    if (req.file) {
      req.body.image_url = req.file.path; // Assuming you want to save the file path in the database
    }
    res
      .status(201)
      .json({ message: "House created successfully", house: req.body });
  }
);
// Note: The upload middleware is used to handle file uploads before creating the house
// If you want to handle file uploads separately, you can adjust this accordingly
// For example, you can use upload.array() if you want to handle multiple files
// or upload.fields() if you want to handle multiple fields with different file inputs
// Adjust the field name "image" based on your form input name
router.put("/:id", requireAuth, updateHouse);
router.delete("/:id", requireAuth, deleteHouse);

export default router;
