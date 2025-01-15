import Order from "../models/OrderModel.js";
import Cart from "../models/CartModel.js";

// Create a new order after successful payment
export const createOrder = async (req, res) => {
    console.log("create")
  try {
    const { userId, cartItems, totalAmount } = req.body;

    if (!userId || !cartItems || !totalAmount) {
      return res.status(400).json({ error: "Invalid data" });
    }

    // Create a new order
    const order = new Order({
      user: userId,
      items: cartItems.map((item) => ({
        product: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
    });

    await order.save();

    // Delete the user's cart after order creation
    await Cart.deleteOne({ user: userId });

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetch orders for a specific user
export const getUserOrders = async (req, res) => {
    console.log("get user irders")
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetch all orders for admin
export const getAllOrders = async (req, res) => {
    console.log("get admin orders")
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
    console.log("update order")
  try {
    const { orderId, status } = req.body;

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



