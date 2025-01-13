
// Cancel.jsx
import React from "react";

const Cancel = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-100 text-red-800">
      <h1 className="text-4xl font-bold mb-4">Payment Canceled</h1>
      <p className="text-lg mb-6">Your payment process was canceled. You can try again at any time.</p>
      <button
        className="bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700"
        onClick={() => (window.location.href = "/cart")}
      >
        Go Back to Cart
      </button>
    </div>
  );
};

export default Cancel;
