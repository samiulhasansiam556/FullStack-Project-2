import Stripe from "stripe";
import OrderModel from "../models/OrderModel.js"; // Adjust the path as needed
import Cart from "../models/CartModel.js"; // Adjust the path as needed

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhookHandler = async (req, res) => {
  // Log the raw body for debugging
  // console.log("Raw Body:", req.body.toString());
   console.log("Webhook Handler Invoked");

  const sig = req.headers["stripe-signature"]; // Retrieve Stripe signature from headers
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Your webhook secret
  /* console.log("Stripe Webhook Secret:", endpointSecret); */

  let event;

  try {
    // Verify the Stripe signature using the raw body
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Process the webhook event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      // Retrieve metadata from the session
      const { userId, cartItems, totalAmount } = session.metadata;

      try {
        // Create an order in the database
        const order = await OrderModel.create({
          user: userId,
          items: JSON.parse(cartItems), // Parse stringified cart items
          totalAmount,
          paymentId: session.payment_intent,
        });
        if (!order) {
          throw new Error("Order creation failed");   
        }
        
        await Cart.deleteOne({userId: userId})



        console.log("Order created successfully");

      } catch (err) {
        console.error("Failed to create order:", err.message);
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Respond to Stripe to acknowledge receipt of the event
  res.status(200).json({ received: true });
};
