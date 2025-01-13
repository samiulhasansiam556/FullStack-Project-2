import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {loadStripe} from '@stripe/stripe-js'
import { FaTrash } from 'react-icons/fa';
import NavIn from '../../components/nav/NavIn';
import toast from 'react-hot-toast';
import Footer from '../../components/footer/Footer';
import Product from '../../../../Server/models/ProductModel';

const url = import.meta.env.VITE_SERVER_URL;
const stripe = import.meta.env.STRIPE_PUBLIC_KEY;

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchCartItems();
  
  }, []);

  const fetchCartItems = async () => {
    const token = localStorage.getItem('authtoken');
    try {
      const response = await axios.get(`${url}/api/user/getcart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data.items);
      setTotalAmount(response.data.totalAmount);
    
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const handleRemoveItem = async (productId, size) => {
    const token = localStorage.getItem('authtoken');
    try {
      await axios.delete(`${url}/api/user/cart/${productId}/${size}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Item removed from cart');
      fetchCartItems(); // Refresh cart after deletion
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };
  console.log(cartItems)

  // const makePayment =async ()=>{

  //        const strip = await loadStripe("pk_test_51QgV6gDwFKgnuGaWgdYeUI5CS8H1cHGworYsq6C8i57oF920qmmegWXAl80pX4AvGBInletQhE9AY4aAuP9uayuu00nh0JPzqp")

  //        const body = {
  //              Products: cartItems
  //        }

  //        const headers = {
  //         "Content-Type":"application/json"
  //        }

  //        const response = await fetch (`${url}/api/user/create-checkout-session`,
  //         {
  //           method : "POST",
  //           headers : headers,
  //           body : JSON.stringify(body)

  //          })

  //          const session = await response.json();

  //          const makePayment =async ()=>{

  //           const stripe = await loadStripe("pk_test_51QgV6gDwFKgnuGaWgdYeUI5CS8H1cHGworYsq6C8i57oF920qmmegWXAl80pX4AvGBInletQhE9AY4aAuP9uayuu00nh0JPzqp")
   
  //           const body = {
  //                 Products: cartItems
  //           }
   
  //           const headers = {
  //            "Content-Type":"application/json"
  //           }
   
  //           const response = await fetch (`${url}/api/user/create-checkout-session`,
  //            {
  //              method : "POST",
  //              headers : headers,
  //              body : JSON.stringify(body)
   
  //             })
   
  //             const session = await response.json();
   
  //            const result = strip.redirectToCheckout({
  //              sessionId:session.id
  //            })
   
  //            if(result.error){
  //              console.log(result.error);
  //            }
  //    }

  //         if(result.error){
  //           console.log(result.error);
  //         }
  // }
  const makePayment = async () => {
    console.log(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  
    try {
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  
      const body = {
        Product: cartItems.map((item) => ({
          name: item.productId.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };
  
      const headers = {
        "Content-Type": "application/json",
      };
  
      const response = await fetch(`${url}/api/user/create-checkout-session`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const session = await response.json();
  
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
  
      if (result.error) {
        console.error("Stripe error:", result.error.message);
      }
    } catch (error) {
      console.error("Error during Stripe payment:", error.message);
    }
  };
  
  


  return (
    <div>
      <NavIn />
      <div className="flex justify-center mt-11 p-2">
        <div className="flex w-full max-w-4xl gap-6">
          {/* Left Side: Cart Items */}
          <div className="flex-1 bg-white shadow-md rounded p-6">
            <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
            {cartItems.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <div>
                {cartItems.map((item) => (
                  <div
                    key={`${item.productId._id}-${item.size}`}
                    className="flex items-center justify-between border-b border-gray-200 py-4"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.productId.imageUrl}
                        alt={item.productId.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h3 className="text-lg font-semibold">
                          {item.productId.name} ({item.size})
                        </h3>
                        <p className="text-gray-500">Price: ${item.price.toFixed(2)}</p>
                        <p className="text-gray-500">Quantity: {item.quantity}</p>
                        <p className="text-gray-500">Total: ${item.total.toFixed(2)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.productId._id, item.size)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Summary and Checkout */}
          <div className="w-1/4 bg-white shadow-md rounded p-6 flex flex-col justify-start">
            <div>
              <h3 className="text-xl font-bold">Order Summary</h3>
              <p className="mt-4 text-lg">Total Items: {cartItems.length}</p>
              <p className="mt-2 text-lg font-semibold">
                Total Amount: ${totalAmount.toFixed(2)}
              </p>
            </div>
            <button 
            onClick={makePayment}
            className="mt-6 bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">
              Proceed to Checkout
            </button>
          </div>
        </div>
        
      </div>

      <Footer/>
    </div>
  );
};

export default Cart;
