
import UserModel from "../models/userModel.js";
import cloudinary from 'cloudinary';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import transporter from "../configs/emailConfig.js";
import CartModel from '../models/CartModel.js'
import Stripe from "stripe";


import Product from "../models/ProductModel.js";
import mongoose from "mongoose";
import BestProduct from "../models/BestProductModel.js";
import CoverImage from "../models/CoverImagesModel.js";
import Category from "../models/CategoryModel.js";
import fs from 'fs';  
import path from 'path';  

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


class UserController {
   
  static userRegistration = async (req, res) => {
        const { name,username, email, password, password_confirmation } = req.body
        const user = await UserModel.findOne({ email: email })
        if (user) {
          res.send({ "status": "failed", "message": "Email already exists" })
        } else {

          const existingUser = await UserModel.findOne({
            username: req.body.username,
          });

          if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
          }
      

          if (name && username && email && password && password_confirmation) {
            if (password === password_confirmation) {
              try {
                const salt = await bcrypt.genSalt(10)
                const hashPassword = await bcrypt.hash(password, salt)
                const doc = new UserModel({
                  name: name,
                  username: username,
                  email: email,
                  password: hashPassword,
        
                })
                await doc.save()
                const saved_user = await UserModel.findOne({ email: email })
                // Generate JWT Token
                const token = jwt.sign({ userID: saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
                res.status(201).send({ "status": "success", "message": "Registration Success", "token": token })
              } catch (error) {
                console.log(error)
                res.send({ "status": "failed", "message": "Unable to Register" })
              }
            } else {
              res.send({ "status": "failed", "message": "Password and Confirm Password doesn't match" })
            }
          } else {
            res.send({ "status": "failed", "message": "All fields are required" })
          }
        }
      }


 static userLogin = async (req, res) => {
        try {
          const { email, password } = req.body

          console.log(req.body)
          
          if (email && password) {
            const user = await UserModel.findOne({ email: email })
            if (user != null) {
              const isMatch = await bcrypt.compare(password, user.password)
              if ((user.email === email) && isMatch) {
                // Generate JWT Token
                const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
                res.send({ "status": "success", "message": "Login Success", "token": token, "role": user.role })
              } else {
                res.send({ "status": "failed", "message": "Email or Password is not Valid" })
              }
            } else {
              res.send({ "status": "failed", "message": "You are not a Registered User" })
            }
          } else {
            res.send({ "status": "failed", "message": "All Fields are Required" })
          }
        } catch (error) {
          console.log(error)
          res.send({ "status": "failed", "message": "Unable to Login" })
        }
     }
  
  
 static updateUser = async (req, res) => {
        try {
          const userId = req.user.id;
          const user = await UserModel.findById(userId);
    
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
    
          // Check if username exists for another user
          const existingUser = await UserModel.findOne({
            username: req.body.username,
            _id: { $ne: userId },
          });
    
          if (existingUser) {
            if (req.file) {
              fs.unlink(req.file.path, (err) => {
                if (err) console.error('Failed to delete uploaded image:', err);
                else console.log('Uploaded image deleted due to duplicate username.');
              });
            }
            return res.status(400).json({ message: 'Username already exists' });
          }

          // Handle Cloudinary upload if a new image file is provided
          let cloudinaryUrl = user.profileImage;
          if (req.file) {
            const localImagePath = path.join(process.cwd(), req.file.path);   
            const result = await cloudinary.uploader.upload(localImagePath);
            fs.unlink(localImagePath, (err) => {
              if (err) console.error('Failed to delete local image:', err);
              else console.log('Local image deleted after Cloudinary upload.');
            });
    
            cloudinaryUrl = result.secure_url;
    
            // Remove old image from Cloudinary if it exists
           if (user.profileImage) {
              const publicId = user.profileImage.split('/').pop().split('.')[0];
              await cloudinary.uploader.destroy(publicId);
            }
          }
    
          // Update user data
          const updatedData = {
            name: req.body.name,
            username: req.body.username,
            phone: req.body.phone,
            address: req.body.address,
            profileImage: cloudinaryUrl,
          };
    
          const updatedProfile = await UserModel.findByIdAndUpdate(userId, updatedData, { new: true });
          console.log(updatedProfile)
          res.json({ user: updatedProfile, message: 'Profile updated successfully' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Error updating profile' });
       }
  };
  
    
//static updateUser = async (req, res) => {
//         try {
//           const userId = req.user.id;
//           const user = await UserModel.findById(userId);
      
//           if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//           }
      
//           // Check if username already exists for another user
//           const existingUser = await UserModel.findOne({
//             username: req.body.username,
//             _id: { $ne: userId },
//           });
      
//           if (existingUser) {
//             if (req.file) {
//               const recentImage = path.join(process.cwd(), req.file.path);
//               fs.unlink(recentImage, (err) => {
//                 if (err) console.error('Failed to delete uploaded image:', err);
//                 else console.log('Uploaded image deleted due to duplicate username.');
//               });
//             }
//             return res.status(400).json({ message: 'Username already exists' });
//           }
      
//           // Delete old profile image if a new one is uploaded
//           if (req.file && user.profileImage) {
//             const uploadResponse = await cloudinary.uploader.upload(req.file.path);
//             console.log(uploadResponse.secure_url)
//             const oldImagePath = path.join(process.cwd(), user.profileImage);
//             fs.unlink(oldImagePath, (err) => {
//               if (err) console.error('Failed to delete old photo:', err);
//               else console.log('Old photo deleted successfully.');
//             });
//           }
      
//           // Prepare updated user data
//           const updatedData = {
//             name: req.body.name,
//             username: req.body.username,
//             phone: req.body.phone,
//             address: req.body.address,
//             profileImage: req.file ? uploadResponse.secure_url : user.profileImage,
//           };
      
//           // Update user in DB
//           const updatedProfile = await UserModel.findByIdAndUpdate(userId, updatedData, { new: true });
//           res.json({ user: updatedProfile, message: 'Profile updated successfully' });
      
//         } catch (error) {
//           console.error(error);
//           res.status(500).json({ error: 'Error updating profile' });
//         }
//       };
          

   
//  static updateUser = async (req, res) => {
//         try {
//           const userId = req.user.id;
//           const user = await UserModel.findById(userId);
      
//           if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//           }
      
//           // Check if username already exists for another user
//           const existingUser = await UserModel.findOne({
//             username: req.body.username,
//             _id: { $ne: userId },
//           });
      
//           if (existingUser) {
//             if (req.file) {
//               const recentImage = path.join(process.cwd(), req.file.path);
//               fs.unlink(recentImage, (err) => {
//                 if (err) console.error('Failed to delete uploaded image:', err);
//                 else console.log('Uploaded image deleted due to duplicate username.');
//               });
//             }
//             return res.status(400).json({ message: 'Username already exists' });
//           }
      
//           // Delete old profile image if a new one is uploaded
//           if (req.file && user.profileImage) {
//             const oldImagePath = path.join(process.cwd(), user.profileImage);
//             fs.unlink(oldImagePath, (err) => {
//               if (err) console.error('Failed to delete old photo:', err);
//               else console.log('Old photo deleted successfully.');
//             });
//           }
      
//           // Prepare updated user data
//           const updatedData = {
//             name: req.body.name,
//             username: req.body.username,
//             phone: req.body.phone,
//             address: req.body.address,
//             profileImage: req.file ? req.file.path : user.profileImage,
//           };
      
//           // Update user in DB
//           const updatedProfile = await UserModel.findByIdAndUpdate(userId, updatedData, { new: true });
//           res.json({ user: updatedProfile, message: 'Profile updated successfully' });
      
//         } catch (error) {
//           console.error(error);
//           res.status(500).json({ error: 'Error updating profile' });
//         }
//       };
      
      
  
    // static updateUser = async (req, res) => {

    //   const user = await UserModel.findById(req.body.id);

    //   if (!user) {
    //     return res.status(404).json({ message: "User not found" });
    //   }

    //   // Delete the existing photo if present
    //   if (user.profileImage) {
    //     const oldImagePath = path.join(process.cwd(), user.profileImage);
    //     fs.unlink(oldImagePath, (err) => {
    //       if (err) console.error("Failed to delete old photo:", err);
    //       else console.log("Old photo deleted successfully.");
    //     });
    //   }

    //     // console.log(req.body.name)
    //     // console.log(req.body.phone)
    //     // console.log(req.file.path)
    //     try {
    //       const updatedData = {
    //         name: req.body.name,
    //         phone: req.body.phone,
    //         address: req.body.address,
    //         profileImage: req.file.path, 
    //       };
      
    //       // Update the existing user profile, assuming user ID is stored in req.user.id
    //       const updatedProfile = await UserModel.findByIdAndUpdate(req.user.id, updatedData, { new: true });
      
    //       res.json(updatedProfile);
    //     } catch (error) {
    //       res.status(500).json({ error: 'Error updating profile' });
    //     }
    //   };
      
      
  
  static changeUserPassword = async (req, res) => {
    const { password, password_confirmation } = req.body
    if (password && password_confirmation) {
      if (password !== password_confirmation) {
        res.send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" })
      } else {
        const salt = await bcrypt.genSalt(10)
        const newHashPassword = await bcrypt.hash(password, salt)
        await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: newHashPassword } })
        res.send({ "status": "success", "message": "Password changed succesfully" })
      }
    } else {
      res.send({ "status": "failed", "message": "All Fields are Required" })
    }
  }

  static loggedUser = async (req, res) => {
    res.send({ "user": req.user })
  }

  static sendUserPasswordResetEmail = async (req, res) => {
    const { email } = req.body
    if (email) {
      const user = await UserModel.findOne({ email: email })
      if (user) {
        const secret = user._id + process.env.JWT_SECRET_KEY
        const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '15m' })
        const link = `${process.env.CLIENT_URL}/resetpassword/${user._id}/${token}`
      
        
       // Send Email
        let info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: "Samiul - Password Reset Link",
          html: `<a href=${link}>Click Here</a> to Reset Your Password`,
        })
        
        res.send({ "status": "success", "message": "Password Reset Email Sent... Please Check Your Email" })

      } else {
        res.send({ "status": "failed", "message": "Email doesn't exists" })
      }
    } else {
      res.send({ "status": "failed", "message": "Email Field is Required" })
    }
  } 
  
  static userPasswordReset = async (req, res) => {
    const { password, password_confirmation } = req.body
    const { id, token } = req.params
    const user = await UserModel.findById(id)
    const new_secret = user._id + process.env.JWT_SECRET_KEY
    try {
      jwt.verify(token, new_secret)
      if (password && password_confirmation) {
        if (password !== password_confirmation) {
          res.send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" })
        } else {
          const salt = await bcrypt.genSalt(10)
          const newHashPassword = await bcrypt.hash(password, salt)
          await UserModel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } })
          res.send({ "status": "success", "message": "Password Reset Successfully" })
        }
      } else {
        res.send({ "status": "failed", "message": "All Fields are Required" })
      }
    } catch (error) {
      console.log(error)
      res.send({ "status": "failed", "message": "Invalid Token" })
    }
  }



static getAllCategries = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


 static getProductByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// static getProductById = async (req,res) =>{
//   const id = rew.user._id;
//   try{
//      const product = await Product.find({id})
//      res.status(200).json(product)
//   }catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// }


static getProductDetails = async (req, res) => {
  try {
    const productId = req.params.id;

    // Find product by ID and populate category if needed
    const product = await Product.findById(productId).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ message: 'Failed to fetch product details' });
  }
};


 static addToCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const { productId, size, quantity } = req.body;

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid user or product ID" });
    }
    if (!size || !quantity || quantity <= 0) {
      return res.status(400).json({ error: "Size and quantity are required, and quantity must be greater than 0" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const itemPrice = product.price;
    const itemTotal = itemPrice * quantity;

    // Find or create cart
    let cart = await CartModel.findOne({ userId });
    if (!cart) {
      cart = new CartModel({
        userId,
        items: [{ productId, size, quantity, price: itemPrice, total: itemTotal }],
        totalAmount: itemTotal
      });
    } else {
      // Check if the same product with the same size exists in the cart
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId && item.size === size
      
      
      
      );
      if (existingItem) {
        return res.status(400).json({ message: "Product with the same size is already in the cart" });
      }

      // Add new item
      cart.items.push({ productId, size, quantity, price: itemPrice, total: itemTotal });
      cart.totalAmount += itemTotal;
    }

    // Save the cart
    await cart.save();
    res.status(200).json({ message: "Product added to cart successfully", cart });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// static addToCart = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { productId } = req.body;

//     // Validate ObjectIds
//     if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
//       return res.status(400).json({ error: 'Invalid user or product ID' });
//     }

//     // Find the cart by userId or create a new one
//     let cart = await CartModel.findOne({ userId });

//     if (!cart) {
//       // Create a new cart if none exists for the user
//       cart = new CartModel({ userId, products: [productId] });
//     } else {
//       // Check if the product is already in the cart
//       if (cart.products.includes(productId)) {
//         return res.status(400).json({ message: 'Product already in cart' });
//       }
//       // Add product if not already present
//       cart.products.push(productId);
//     }

//     // Save the cart document and send a success response
//     await cart.save();
//     res.status(200).json({ message: 'Product added successfully', cart });

//   } catch (error) {
//     console.error("Error in addToCart:", error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };


// static addToCart = async (req, res) => {
//   try {
//     const { userId, productId } = req.body;
//     let cart = await CartModel.findOne({ userId });

//     if (!cart) {
//       cart = new CartModel({ userId, products: [productId] });
//     } else {
//       if (!cart.products.includes(productId)) cart.products.push(productId);
//     }

//     await cart.save();
//     res.json(cart);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };


static removeFromCart = async (req, res) => {
  const { productId, size } = req.params;
  const userId = req.user.id;

  try {
    const cart = await CartModel.findOne({ userId });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.size === size
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in the cart' });
    }

    const removedItem = cart.items[itemIndex];
    cart.totalAmount -= removedItem.total;

    cart.items.splice(itemIndex, 1);

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing item from cart', error });
  }
};



static getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await CartModel.findOne({ userId }).populate('items.productId');

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // Calculate the total amount dynamically (if not already handled in hooks)
    cart.totalAmount = cart.items.reduce((total, item) => total + item.total, 0);

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error });
  }
};


static deleteToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await CartModel.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.products = cart.products.filter(
      (product) => product.toString() !== productId
    );
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing product from cart', error });
  }
};


//   try {
//     const { userId, productId } = req.params;
//     const cart = await CartModel.findOne({ userId });

//     if (cart) {
//       cart.products = cart.products.filter(id => id.toString() !== productId);
//       await cart.save();
//       res.json(cart);
//     } else {
//       res.status(404).json({ error: 'Cart not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };
//


//Fetch all best products
static getBestProducts = async (req, res) => {
  try {
    const bestProducts = await BestProduct.find().populate('productId');
    res.status(200).json(bestProducts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching best products.' });
  }
};


static getCoverImages = async (req, res) => {
  try {
    const images = await CoverImage.find(); // Fetch all images from the database
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch images", error });
  }
};


static getCategories = async (req, res) => {
  const categories = await CategoryModel.find();
  res.json(categories);
};


static paymentGateWay = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const { Product } = req.body; // Expecting an array of products

    if (!Product || !Array.isArray(Product) || Product.length === 0) {
      return res.status(400).json({ error: "Invalid product data" });
    }

    // Convert products into Stripe-compatible line items
    const lineItems = Product.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: { 
          name: product.name || "Unnamed Product", // Provide a fallback for name
        },
        unit_amount: Math.round(product.price * 100), // Stripe expects amounts in cents
      },
      quantity: product.quantity || 1, // Default quantity to 1 if not provided
      totalAmount: product.totalAmount,
    }));

    // Create the Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        userId: req.user.id, // Pass the user's ID
        cartItems: JSON.stringify(Product), // Pass cart items as a JSON string
        totalAmount: Product.reduce((total, item) => total + item.price * item.quantity, 0), // Calculate total
      },
    });
  

    // console.log(session)
    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({ error: "Unable to create checkout session" });
  }
};

}

export default UserController 

