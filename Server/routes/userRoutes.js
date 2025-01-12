import express from "express";
import UserController from "../controllers/userController.js";
import checkUserAuth from "../middlewares/user-auth-middlewares.js";
import upload from "../configs/multerConfig.js"


const router = express.Router();

//Route Level Middleware - To Protect Routecons
router.use('/changepassword', checkUserAuth)
router.use('/loggeduser', checkUserAuth)
router.use('/updateuser', checkUserAuth)

 router.use('/catagories',checkUserAuth)
router.use('/products/:categoryId',checkUserAuth)
router.use('/cart',checkUserAuth)
router.use('/getcart',checkUserAuth)
router.use('/cart/:userId/:productId',checkUserAuth)
router.use('/cart/:productId/:size',checkUserAuth)


router.use('/productdetails/:id',checkUserAuth)


//Public Routes
router.post('/register', UserController.userRegistration);
router.post('/login', UserController.userLogin)
router.post('/send-reset-password-email', UserController.sendUserPasswordResetEmail)
router.post('/reset/:id/:token', UserController.userPasswordReset)



//Protected Routes
router.post('/changepassword', UserController.changeUserPassword)
router.get('/loggeduser', UserController.loggedUser)
router.post('/updateuser',upload.single("image") ,UserController.updateUser)

router.get('/categories',UserController.getAllCategries)
router.get('/products/:categoryId',UserController.getProductByCategory)
router.get('/productdetails/:id',UserController.getProductDetails)
router.post('/cart',UserController.addToCart)
router.get('/getcart',UserController.getCart)
router.delete('/cart/:productId',UserController.deleteToCart)
router.delete('/cart/:productId/:size',UserController.removeFromCart)
router.get("/getcoverimage",checkUserAuth,UserController.getCoverImages);
router.get('/getbestproduct', checkUserAuth,UserController.getBestProducts);
router.get('/categories', checkUserAuth,UserController.getCategories);




export default router