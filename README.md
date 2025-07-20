# E-Commerce Platform

A full-stack e-commerce web application built with React.js and Node.js, featuring a complete online shopping experience with user authentication, product management, shopping cart, payment processing, and admin dashboard.

## 🚀 Features

### User Features
- **Authentication System**
  - User registration and login
  - JWT-based authentication
  - Password reset via email
  - Profile management with image upload

- **Shopping Experience**
  - Browse products by categories
  - Product search and filtering
  - Detailed product pages with multiple sizes
  - Shopping cart management
  - Secure checkout with Stripe payment
  - Order tracking and history

- **User Dashboard**
  - Profile editing
  - Order history
  - Password change functionality

### Admin Features
- **Admin Dashboard**
  - Complete administrative interface
  - User management
  - Analytics and overview

- **Product Management**
  - Create, edit, and delete products
  - Image upload via Cloudinary
  - Category management
  - Size variants (S, M, L, XL, XXL)

- **Order Management**
  - View all orders
  - Update order status
  - Track payment status

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **React Icons & FontAwesome** - Icon libraries
- **Stripe.js** - Payment processing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload middleware
- **Cloudinary** - Image storage and management
- **Stripe** - Payment processing
- **Nodemailer** - Email service

## 📁 Project Structure

```
├── Client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── admin/         # Admin panel components
│   │   ├── assets/        # Images and static assets
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   │   ├── home/      # Home pages
│   │   │   ├── product/   # Product pages
│   │   │   ├── cart/      # Shopping cart
│   │   │   ├── signin/    # Authentication
│   │   │   └── ...
│   │   └── routes/        # Route protection
│   ├── package.json
│   └── vite.config.js
│
├── Server/                # Node.js backend
│   ├── configs/           # Configuration files
│   ├── controllers/       # Business logic
│   ├── middlewares/       # Custom middleware
│   ├── models/            # MongoDB schemas
│   │   ├── userModel.js
│   │   ├── ProductModel.js
│   │   ├── OrderModel.js
│   │   └── ...
│   ├── routes/            # API endpoints
│   ├── public/            # Static files
│   ├── package.json
│   └── server.js          # Main server file
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Stripe account for payment processing
- Cloudinary account for image storage

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-platform
   ```

2. **Install Backend Dependencies**
   ```bash
   cd Server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../Client
   npm install
   ```

### Environment Variables

Create `.env` files in both Client and Server directories:

#### Server/.env
```env
PORT=5000
DATABASE_URL=mongodb://localhost:27017/ecommerce
# or MongoDB Atlas connection string

JWT_SECRET=your_jwt_secret_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Email Configuration (for password reset)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

#### Client/.env
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd Server
   npm start
   ```
   The server will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd Client
   npm run dev
   ```
   The client will run on `http://localhost:5173`

## 📱 Usage

### For Users
1. **Registration**: Create a new account or sign in
2. **Browse Products**: Explore products by categories
3. **Shopping**: Add items to cart, select sizes
4. **Checkout**: Secure payment processing with Stripe
5. **Profile**: Manage profile and view order history

### For Admins
1. **Admin Access**: Sign in with admin credentials
2. **Dashboard**: Access admin panel at `/admin/dashboard`
3. **Manage Products**: Create, edit, delete products
4. **Manage Categories**: Organize products by categories
5. **Order Management**: Track and update order status

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Tokens are stored in localStorage
- Protected routes require valid tokens
- Role-based access control (user/admin)

## 💳 Payment Integration

Stripe is integrated for secure payment processing:
- Credit/debit card payments
- Webhook handling for payment confirmation
- Secure checkout process

## 🖼️ Image Management

Cloudinary is used for image storage:
- Product image uploads
- User profile pictures
- Automatic image optimization

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables in deployment platform

### Backend (Heroku/Railway/DigitalOcean)
1. Set up production environment variables
2. Configure MongoDB connection
3. Deploy server files
4. Set up Stripe webhooks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 API Endpoints

### Authentication
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `POST /api/user/reset-password` - Password reset

### Products
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create product (Admin)
- `PUT /api/admin/products/:id` - Update product (Admin)
- `DELETE /api/admin/products/:id` - Delete product (Admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status (Admin)

### Categories
- `GET /api/admin/categories` - Get all categories
- `POST /api/admin/categories` - Create category (Admin)

## 📄 License

This project is licensed under the ISC License.

## 🐛 Known Issues

- Responsive design improvements in progress
- Some deployment configurations may need adjustment

## 📞 Support

For support and questions, please open an issue in the repository.

---

**Built with ❤️ using React, Node.js, and MongoDB**