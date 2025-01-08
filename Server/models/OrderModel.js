

import mongoose from "mongoose";

// OrderModel.js
const OrderSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
  });
 
  const Order = mongoose.model('Order', OrderSchema);

  export default Order