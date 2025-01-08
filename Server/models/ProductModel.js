// models/ProductModel.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String }, // URLs to images stored in Cloudinary or another service
  sizes: [{ type: String, enum: ['S', 'M', 'L', 'XL', 'XXL'] }], // Allow multiple sizes
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', ProductSchema);
export default Product;
