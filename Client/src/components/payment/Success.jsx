// Success.jsx
import React from "react";

const Success = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100 text-green-800">
      <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-lg mb-6">Thank you for your purchase. Your payment has been successfully processed.</p>
      <button
        className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700"
        onClick={() => (window.location.href = "/home")}
      >
        Go to Homepage
      </button>
    </div>
  );
};

export default Success;
