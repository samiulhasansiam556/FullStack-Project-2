

import express from "express";

import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import  checkUserAuth from "../middlewares/user-auth-middlewares.js";
import  checkAdmin from "../middlewares/admin-auth-middlewares.js";

const router = express.Router();


// Create a new order
router.post("/create", checkUserAuth, createOrder);

// Get orders for a user
router.get("/user/:userId", checkUserAuth, getUserOrders);

// Get all orders (Admin only)
router.get("/admin", checkAdmin, getAllOrders);

// Update order status (Admin only)
router.put("/update-status/:userId",checkAdmin, updateOrderStatus);


export default router