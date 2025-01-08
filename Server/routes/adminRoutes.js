import express from "express";
import upload from '../configs/multerConfig.js'
import checkAdmin from "../middlewares/admin-auth-middlewares.js";
import { getCategories,createCategory,deleteCategory,getProducts,
    createProduct,deleteProduct,updateProduct,getOrders, 
    updateOrderStatus } from '../controllers/adminController.js';

const router = express.Router();


router.get('/check-admin', checkAdmin, (req, res) => {
    res.status(200).json({ role: req.user.role });
});


// Category Routes
router.get('/categories', checkAdmin, getCategories);
router.post('/categoriescreate', checkAdmin,createCategory);
router.delete('/categories/:id', checkAdmin, deleteCategory);



// Product Routes
router.get('/products', checkAdmin, getProducts);
router.post('/productscreate', checkAdmin,upload.single("image"),  createProduct);
router.delete('/products/:id',checkAdmin,deleteProduct)
router.put('/products/:productId', updateProduct);
router.put('/products/:productId', updateProduct);

// Order Routes
router.get('/orders', checkAdmin, getOrders);
router.put('/orders/:id', checkAdmin, updateOrderStatus);


export default router