import express from "express";
import { stripeWebhookHandler } from "../controllers/webhookHandler.js";

const router = express.Router();

router.post(
  "/webhook",
      //  express.raw({ type: "application/json" }), // Ensure raw body for Stripe webhook
  stripeWebhookHandler
);

export default router;
