// models/Cart.js
// import mongoose from "mongoose";

// const cartSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   products: [
//     { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
//   ],
// });

// const CartModel = mongoose.model('Cart', cartSchema);

// export default CartModel;

// models/Cart.js
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      size: { type: String, required: true }, // Size of the product
      quantity: { type: Number, required: true, default: 1 },
      price: { type: Number, required: true },
      total: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const CartModel = mongoose.model("Cart", cartSchema);
export default CartModel;
