import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const url = import.meta.env.VITE_SERVER_URL;

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("authtoken");
        const response = await axios.get(`${url}/api/user/productdetails/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProduct(response.data);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
        toast.error("Failed to load product details");
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!selectedSize || quantity <= 0) {
      toast.error("Please select a size and valid quantity!");
      return;
    }

    try {
      const token = localStorage.getItem("authtoken");
      const response = await axios.post(
        `${url}/api/user/cart`,
        {
          productId: id,
          size: selectedSize,
          quantity,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message);
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      toast.error(error.response.data.message);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row  items-center  h-[100vh] bg-white shadow-lg rounded-lg p-6 space-y-6 md:space-y-0 md:space-x-6">
        <div className="w-full md:w-1/2">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-[80vh] object-cover mb-4 object-fit:contain rounded-md"
          />
        </div>
        <div className="w-full md:w-1/2 h-[80vh]">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h2>
          <p className="text-xl text-gray-600 mb-2">Price: ${product.price}</p>
          <p className="text-lg text-gray-600 mb-2">
            Category: {product.category?.categoryName || "N/A"}
          </p>
          <p className="text-lg text-gray-600 mb-4">
            Available Sizes: {product.sizes.join(", ")}
          </p>

          {/* Size Selector */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Select Size</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a size</option>
              {product.sizes.map((size, index) => (
                <option key={index} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity Selector */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
