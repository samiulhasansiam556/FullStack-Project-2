

import mongoose from "mongoose";

// CategoryModel.js
const CategorySchema = new mongoose.Schema({
   categoryName: {type:String},
   createdAt: { type: Date, default: Date.now },
});

 const Category = mongoose.model('Category', CategorySchema);

export default Category;