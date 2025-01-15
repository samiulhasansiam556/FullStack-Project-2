import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User ID
    items: [
      {
        product: {
           type: mongoose.Schema.Types.ObjectId, ref: "Product",
        },
        name: {type:String,required:true},
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, // Per unit price
      },
    ],
    totalAmount: { type: Number, required: true }, // Total order price
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    paymentId: {type:String},
    paymentStatus: { type: String, enum: ["Paid", "Unpaid"], default: "Paid" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("Order", OrderSchema);

export default OrderModel