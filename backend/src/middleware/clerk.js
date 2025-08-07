import { verifyToken } from "@clerk/express";

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify the token and get user data
    const decoded = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    // ✅ FIXED: Set user data correctly
    req.user = {
      clerk_id: decoded.sub, // 'sub' contains the Clerk user ID
      ...decoded,
    };

    console.log("Authenticated user:", req.user.clerk_id); // Debug log

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
