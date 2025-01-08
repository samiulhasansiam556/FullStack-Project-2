import cloudinary from 'cloudinary';
import Category from '../models/CategoryModel.js'
import Product from '../models/ProductModel.js'
import Order from '../models/OrderModel.js'


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


// Fetch all products with populated category name
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'categoryName'); // Populate only the 'name' field of the category
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

export const createProduct = async (req, res) => {
  const { name, price, category,sizes } = req.body;

  // Basic validation for required fields
  if (!name || !price || !category || !sizes || !req.file) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Upload the image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(req.file.path);
    const imageUrl = uploadedImage.secure_url;


    // Create a new product with the provided data
    const product = new Product({ name, price,imageUrl, category,sizes: sizes.split(','), imageUrl });
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully", deletedProduct });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Error deleting category" });
  }
};

// Update a product
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



export const getOrders = async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(order);
};

