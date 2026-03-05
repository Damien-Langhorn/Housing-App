import express from "express";
import multer from "multer";
import { requireAuth } from "../middleware/clerk.js";
import { uploadRateLimit } from "../middleware/rateLimiter.js";

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// POST /api/upload - Upload file to Pinata
router.post(
  "/",
  uploadRateLimit,
  requireAuth,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file provided",
        });
      }

      const PINATA_JWT = process.env.PINATA_JWT;
      const GATEWAY_URL = process.env.PINATA_GATEWAY_URL;

      if (!PINATA_JWT) {
        console.error("PINATA_JWT not configured");
        return res.status(500).json({
          success: false,
          message: "Upload service not configured",
        });
      }

      // Create form data for Pinata
      const formData = new FormData();
      const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
      formData.append("file", blob, req.file.originalname);

      // Upload to Pinata
      const pinataResponse = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${PINATA_JWT}`,
          },
          body: formData,
        },
      );

      if (!pinataResponse.ok) {
        const errorText = await pinataResponse.text();
        console.error("Pinata upload failed:", errorText);
        return res.status(500).json({
          success: false,
          message: "Failed to upload to IPFS",
        });
      }

      const pinataData = await pinataResponse.json();
      const ipfsUrl = `https://${GATEWAY_URL}/ipfs/${pinataData.IpfsHash}`;

      console.log("File uploaded successfully:", ipfsUrl);

      res.json({
        success: true,
        ipfsUrl,
        ipfsHash: pinataData.IpfsHash,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        success: false,
        message: "Upload failed",
        error: error.message,
      });
    }
  },
);

export default router;
