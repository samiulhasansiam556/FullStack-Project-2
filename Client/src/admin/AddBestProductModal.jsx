import { useState, useEffect } from "react";
import axios from "axios";

const url = import.meta.env.VITE_SERVER_URL;

function AddBestProductModal({ onClose, onRefresh }) {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      const { data } = await axios.get(`${url}/api/admin/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSelect = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("authtoken");
    try {
      await axios.post(
        `${url}/api/admin/products/addbestproduct`,
        { productIds: selectedProducts },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Error adding best products:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Select Products to Add</h2>
        <div className="space-y-4 overflow-y-auto max-h-80">
          {products.map((product) => (
            <div
              key={product._id}
              className="flex items-center justify-between p-4 bg-gray-100 rounded-md"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={product.imageUrl || "/placeholder-image.png"}
                  alt={product.name}
                  className="w-16 h-24 object-cover rounded-md"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">{product.name}</h3>
                  <p className="text-gray-600">
                    Category: {product.category?.categoryName || "N/A"}
                  </p>
                  <p className="text-gray-600">Price: ${product.price}</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={selectedProducts.includes(product._id)}
                onChange={() => handleSelect(product._id)}
                className="form-checkbox text-blue-600"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Selected Products
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddBestProductModal;
