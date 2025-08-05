import express from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import User from "../models/User.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const event = await verifyWebhook(
      req,
      process.env.CLERK_WEBHOOK_SIGNING_SECRET
    );

    if (event.type === "user.created") {
      const { id, email_addresses, username } = event.data;
      await User.create({
        clerk_id: id,
        email: email_addresses[0]?.email_address,
        username: username || email_addresses[0]?.email_address || id,
        password: "placeholder", // Placeholder, as Clerk handles authentication
      });
      console.log("New Clerk user saved to DB:", id);
    }

    res.status(200).send("Webhook received");
  } catch (err) {
    console.error("Error verifying webhook:", err);
    res.status(400).send("Error verifying webhook");
  }
});

export default router;
