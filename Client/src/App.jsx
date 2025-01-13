import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import { Toaster } from 'react-hot-toast';
import '@fortawesome/fontawesome-free/css/all.min.css';

import HomeOut from './pages/home/HomeOut';
import HomeIn from './pages/home/HomeIn';
import AdminProtectedRoute from './routes/AdminProtectedRoutes';
import ProtectedRoute from './routes/protectedRoute';
import SignUp from './pages/signup/SignUp';
import SignIn from './pages/signin/SignIn';
import ChangePassword from './pages/changepassword/ChangePassword';
import ResetEmailSend from './pages/resetpassword/ResetEmailSend';
import ResetPassword from './pages/resetpassword/ResetPassword';
import ProfileEdit from './pages/profile/ProfileEdit';
import NotFound from './pages/notfound/NotFound'; // New 404 component
import AdminDashboard from './admin/AdminDashboard';
import CategoryList from './admin/CategoryList';
import CategoryCreate from './admin/CategoryCreate';
import ProductList from './admin/ProductList';
import ProductCreate from './admin/ProductCreate';
import OrderList from './admin/OrderList';
import ProductPage from './pages/product/ProductPage';
import About from './pages/about/About';
import ContactPage from './pages/contact/ContactPage';
import Cart from './pages/cart/Cart';
import ProductDetails from './pages/product/ProductDetailPage';
import Success from './components/payment/Success';
import Cancel from './components/payment/Cancel';

function App() {
  const router = createBrowserRouter([
   
    {
      path: '/',
      element: <HomeOut />,
    },
   
    {
      path: '/home',
      element: <ProtectedRoute />,
      children: [
        {
          path: '',
          element: <HomeIn/>,
        },
        {
          path: 'changepassword',
          element: <ChangePassword />,
        }, 
        {
          path: 'editprofile',
           element: <ProfileEdit />,
        },

        { 
          path: 'products',
          element: <ProductPage/> 
        },
        { 
          path: 'about',
          element: <About/> 
        },
        { 
          path: 'contact',
          element: <ContactPage/> 
        },
        { 
          path: 'cart',
          element: <Cart/> 
        },
        { 
          path: 'productdeails/:id',
          element: <ProductDetails/>
        },

        
           
       
      ],
    },
 
   {
    path: '/admin/dashboard',
    element: <AdminProtectedRoute/>,
    children: [
      { 
        path: '',
        element: <AdminDashboard /> 
      },
      { 
        path: 'categorylist',
        element: <CategoryList/> 
      },
      { 
        path: 'createcategory',
        element: <CategoryCreate/>
      },
      { 
        path: 'productlist',
        element: <ProductList/>
      },
      { 
        path: 'productcreate',
        element: <ProductCreate/> 
      },
      { 
        path: 'orderlist',
        element: <OrderList/> 
      },

     
      
    ],
   },



    {
      path: '/signup',
      element: <SignUp />,
    },
    {
      path: '/signin',
      element: <SignIn />,
    },
    {
      path: '/resetemailsend',
      element: <ResetEmailSend />,
    },
    {
      path: '/resetpassword/:id/:token',
      element: <ResetPassword />,
    },
    {
      path: '/success',
      element: <Success/>,
    },
    {
      path: '/cancel',
      element: <Cancel/>,
    },
    // Catch-all 404 route
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
}

export default App;
