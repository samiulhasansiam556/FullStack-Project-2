import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NavIn from "../../components/nav/NavIn";
import toast from "react-hot-toast";

const url = import.meta.env.VITE_SERVER_URL;

const ProductPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [productId, setProductId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productDetails, setProductDetails] = useState(null); // For modal details
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSize, setSelectedSize] = useState(""); // Selected size
  const [quantity, setQuantity] = useState(1); // Selected quantity

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("authtoken");
        const response = await axios.get(`${url}/api/user/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data);
        if (response.data.length > 0) {
          setSelectedCategory(response.data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (selectedCategory) {
          const token = localStorage.getItem("authtoken");
          const response = await axios.get(
            `${url}/api/user/products/${selectedCategory}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  // Open Modal and fetch product details
  const openModal = async (id) => {
    setProductId(id);
    try {
      const token = localStorage.getItem("authtoken");
      const response = await axios.get(`${url}/api/user/productdetails/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductDetails(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  // Add to Cart
  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("Please select a size!");
      return;
    }

    try {
      const token = localStorage.getItem("authtoken");
      const response = await axios.post(
        `${url}/api/user/cart`,
        { productId, size: selectedSize, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message, { position: "top-right" });
      setShowModal(false); // Close modal
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        // Display the backend message
        toast.error(error.response.data.message);
      } else {
        // General fallback error
        console.error("Error adding to cart:", error);
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div>
      <NavIn />
      <div className="flex bg-gray-100 min-h-screen">
        <aside className="w-1/4 p-6 bg-white shadow-lg">
          <h3 className="text-xl font-bold mb-6 text-gray-700">Categories</h3>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li
                key={category._id}
                onClick={() => setSelectedCategory(category._id)}
                className={`cursor-pointer p-2 rounded-md text-gray-600 ${
                  selectedCategory === category._id
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-100"
                }`}
              >
                {category.categoryName}
              </li>
            ))}
          </ul>
        </aside>

        <section className="w-3/4 p-6">
          <h3 className="text-2xl font-bold mb-4 text-gray-700">Products</h3>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="border rounded-lg p-4 bg-white shadow-lg"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover mb-4 rounded-md"
                  />
                  <h4 className="font-semibold text-lg text-gray-800 mb-2">
                    {product.name}
                  </h4>
                  <p className="text-gray-600 mb-4">${product.price}</p>
                  <Link
                    to={`/home/productdeails/${product._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View Details
                  </Link>
                 
                  <button
                    onClick={() => openModal(product._id)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold mt-2"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No products available in this category.
            </p>
          )}
        </section>
      </div>

      {/* Modal */}
      {showModal && productDetails && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 ">
            <h3 className="text-xl font-bold mb-4">{productDetails.name}</h3>
            <img
              src={productDetails.imageUrl}
              alt={productDetails.name}
              className="w-full h-48 object-cover mb-4 rounded-md"
            />
            <p className="text-gray-600 mb-4">${productDetails.price}</p>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Select Size</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select size</option>
                {productDetails.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-2 border rounded-md"
                min="1"
              />
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold"
            >
              Add to Cart
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-semibold mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
