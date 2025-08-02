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
  "/upload_image",
  upload.single("image"),
  uploadImage // Handle single file upload with field name 'image'
);
function uploadImage(req, res) {
  console.log("req file", req.file);
  res.json({
    message: "Image uploaded successfully",
  });
}
router.put("/:id", requireAuth, updateHouse);
router.delete("/:id", requireAuth, deleteHouse);

export default router;
