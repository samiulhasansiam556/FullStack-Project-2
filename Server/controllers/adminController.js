import cloudinary from 'cloudinary';
import Category from '../models/CategoryModel.js'
import Product from '../models/ProductModel.js'
import Order from '../models/OrderModel.js'
import BestProduct from '../models/BestProductModel.js'
import CoverImage from "../models/CoverImagesModel.js";

//Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

export const createCategory = async (req, res) => {
  const { categoryName } = req.body;

  try {
    // Check if a category with the same name already exists
    const existingCategory = await Category.findOne({ categoryName });

    if (existingCategory) {
      return res.status(400).json({ message: "This category already exists" });
    }

    // If it doesn't exist, create a new category
    const category = new Category({ categoryName });
    await category.save();

    res.status(201).json({message:"Category created successfully!",category}); // Respond with the created category
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "An error occurred while creating the category" });
  }
};


export const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully", deletedCategory });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Error deleting category" });
  }
};



export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'categoryName'); // Populate only the 'name' field of the category
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

import fs from "fs"
export const createProduct = async (req, res) => {
  const { name, price, category,sizes } = req.body;

  // Basic validation for required fields
  if (!name || !price || !category || !sizes || !req.file) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // console.log(req.file.path) 
    // Upload the image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(req.file.path);
    const imageUrl = uploadedImage.secure_url;
    // console.log(uploadedImage)

    // Create a new product with the provided data
    const product = new Product({ name, price,imageUrl, category,sizes: sizes.split(','), imageUrl });
    const result = await product.save();

    // console.log(result)
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Failed to delete local image:', err);
      else console.log('Local image deleted after Cloudinary upload.');
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const imagepath = await Product.findById(productId)
    const deletedProduct = await Product.findByIdAndDelete(productId);

    // console.log(imagepath)

    if (!deletedProduct) {
      return res.status(404).json({ message: "Category not found" });
    }

     const publicId = imagepath.imageUrl.split('/').pop().split('.')[0];
     await cloudinary.uploader.destroy(publicId);

    res.status(200).json({ message: "Category deleted successfully", deletedProduct });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Error deleting category" });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updatedData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedData,
      { new: true } // Return the updated document
    ).populate('category', 'name'); // Populate category name for response consistency

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update product' });
  }
};




export const getBestProducts = async (req, res) => {
  try {
    const bestProducts = await BestProduct.find().populate('productId');
    res.status(200).json(bestProducts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching best products.' });
  }
};






export const addBestProducts = async (req, res) => {
  try {
    const { productIds } = req.body; // Array of product IDs
    const bestProducts = productIds.map((id) => ({ productId: id }));
    await BestProduct.insertMany(bestProducts);
    res.status(201).json({ message: 'Best products added successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding best products.' });
  }
};


export const deleteBestProduct = async (req, res) => {
  try {
    const { id } = req.params; // Best product ID
    await BestProduct.findByIdAndDelete(id);
    res.status(200).json({ message: 'Best product deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting best product.' });
  }
};



export const getOrders = async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(order);
};



export const getCoverImages = async (req, res) => {
  try {
    const images = await CoverImage.find(); // Fetch all images from the database
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch images", error });
  }
};





export const uploadCoverImage = async (req, res) => {
  try {
    const file = req.file; // Expecting multer to handle file upload

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "cover-images",
    });

    // Save image details to MongoDB
    const newImage = new CoverImage({
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
    await newImage.save();

    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Failed to delete local image:', err);
      else console.log('Local image deleted after Cloudinary upload.');
    });

    res.status(201).json({ message: "Image uploaded successfully", image: newImage });
  } catch (error) {
    res.status(500).json({ message: "Failed to upload image", error });
  }
};



export const deleteCoverImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Find image in database
    const image = await CoverImage.findById(id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    // Remove image from database
    await CoverImage.findByIdAndDelete(id);

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete image", error });
  }
};


