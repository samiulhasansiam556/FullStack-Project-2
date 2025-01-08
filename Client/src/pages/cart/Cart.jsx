import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import NavIn from '../../components/nav/NavIn';
import toast from 'react-hot-toast';

const url = import.meta.env.VITE_SERVER_URL;

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
            <button className="mt-6 bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">
              Proceed to Checkout
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Cart;
