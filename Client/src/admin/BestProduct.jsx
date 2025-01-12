import { useState, useEffect } from "react";
import axios from "axios";
import AddBestProductModal from "./AddBestProductModal";

const url = import.meta.env.VITE_SERVER_URL;

function BestProduct() {
  const token = localStorage.getItem("authtoken");
  const [bestProducts, setBestProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchBestProducts();
  }, []);

  const fetchBestProducts = async () => {
    try {
      const { data } = await axios.get(`${url}/api/admin/products/getbestproduct`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBestProducts(data || []);
    } catch (error) {
      console.error("Error fetching best products:", error);
    }
  };

  const deleteBestProduct = async (id) => {
    try {
      await axios.delete(`${url}/api/admin/products/deletebestproduct/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchBestProducts();
    } catch (error) {
      console.error("Error deleting best product:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Best Products</h2>
      <button
        onClick={() => setModalOpen(true)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Add Best Products
      </button>

      {bestProducts.length > 0 ? (
        <ul className="space-y-4">
          {bestProducts.map((item) => (
            <li key={item._id} className="flex items-center justify-between p-4 bg-gray-100 rounded-md">
              <div className="flex items-center space-x-4">
                <img
                  src={item.productId?.imageUrl || "/placeholder-image.png"}
                  alt={item.productId?.name || "Unnamed Product"}
                  className="w-16 h-24 object-cover rounded-md"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">{item.productId?.name || "Unnamed Product"}</h3>
                  <p className="text-gray-600">
                    Category: {item.productId?.category?.categoryName || "N/A"}
                  </p>
                  <p className="text-gray-600">Price: ${item.productId?.price || "N/A"}</p>
                  <p className="text-gray-500 text-sm">
                    Added on:{" "}
                    {item.productId?.createdAt
                      ? new Date(item.productId.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteBestProduct(item._id)}
                className="text-red-500 hover:text-red-700 font-semibold"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No best products available.</p>
      )}

      {modalOpen && (
        <AddBestProductModal
          onClose={() => setModalOpen(false)}
          onRefresh={fetchBestProducts}
        />
      )}
    </div>
  );
}

export default BestProduct;
