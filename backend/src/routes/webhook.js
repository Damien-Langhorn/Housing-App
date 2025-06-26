import express from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import User from "../models/User.js"; // Adjust the path as needed

const router = express.Router();

router.post(
  "/webhooks",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const event = await verifyWebhook(
        req,
        process.env.CLERK_WEBHOOK_SIGNING_SECRET
      );

      if (event.type === "user.created") {
        const { id, email_addresses, username, password } = event.data;
        await User.create({
          clerk_id: id,
          email: email_addresses[0]?.email_address,
          username: username || email_addresses[0]?.email_address || id, // Fallback to email or ID if username not provided
          password: "clerk", // or leave blank/null if not used
        });
        console.log(
          "New Clerk user saved to DB:",
          id,
          email_addresses,
          username
        );
      }

      console.log("Received Clerk webhook:", event.type, event.data);
      res.status(200).send("Webhook received");
    } catch (err) {
      console.error("Error verifying webhook:", err);
      res.status(400).send("Error verifying webhook");
    }
  }
);

export default router;
