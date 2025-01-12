import { useState, useEffect } from "react";
import { useNavigate ,Link} from "react-router-dom";
import axios from "axios";
import NavIn from "../../components/nav/NavIn";
import toast from "react-hot-toast";
import Footer from "../../components/footer/Footer";

const url = import.meta.env.VITE_SERVER_URL;

function HomeIn() {
  const [sliderImages, setSliderImages] = useState([]);
  const [bestProducts, setBestProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [selectedSize, setSelectedSize] = useState(""); // Selected size for the product
  const [quantity, setQuantity] = useState(1); // Selected quantity for the product
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSliderImages = async () => {
      const token = localStorage.getItem("authtoken");
      try {
        const res = await axios.get(`${url}/api/user/getcoverimage`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSliderImages(res.data);
      } catch (error) {
        console.error("Error fetching slider images:", error);
      }
    };

    const fetchBestProducts = async () => {
      const token = localStorage.getItem("authtoken");
      try {
        const res = await axios.get(`${url}/api/user/getbestproduct`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBestProducts(res.data);
      } catch (error) {
        console.error("Error fetching best products:", error);
      }
    };

    const fetchCategories = async () => {
      const token = localStorage.getItem("authtoken");
      try {
        const res = await axios.get(`${url}/api/user/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchSliderImages();
    fetchBestProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        sliderImages.length > 0 ? (prevSlide + 1) % sliderImages.length : 0
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [sliderImages]);

  const openModal = async (id) => {
    try {
      const token = localStorage.getItem("authtoken");
      const res = await axios.get(`${url}/api/user/productdetails/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductDetails(res.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("Please select a size!");
      return;
    }

    try {
      const token = localStorage.getItem("authtoken");
      const res = await axios.post(
        `${url}/api/user/cart`,
        { productId: productDetails._id, size: selectedSize, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message, { position: "top-right" });
      setShowModal(false);
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavIn />

      {/* Full-Page Slider */}
      <section className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0">
          {sliderImages.length > 0 ? (
            sliderImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
                style={{ backgroundImage: `url(${image.imageUrl})` }}
              >
                <div className="bg-black bg-opacity-50 text-white text-center flex items-center justify-center h-full">
                  <h1 className="text-3xl font-bold">
                    Welcome to Our Store!
                    <br />
                    Discover Stunning Products.
                  </h1>
                </div>
              </div>
            ))
          ) : (
            <p>Loading slider...</p>
          )}
        </div>
      </section>

      {/* Best Products */}
      <main className="container px-4 py-8">
        <h2 className="text-2xl text-center pt-20 pb-10 text-blue-700 font-bold mb-4">
          Best Products
        </h2>
        <div className="grid px-20 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestProducts.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <img
                src={item.productId.imageUrl}
                alt={item.productId.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{item.productId.name}</h3>
                <p className="text-gray-500">${item.productId.price}</p>
                <p className="text-sm text-gray-400">
                  Category: {item.productId.category?.categoryName}
                </p>
                <Link
                    to={`/home/productdeails/${item.productId._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View Details
                  </Link>
                 
                  <button
                    onClick={() => openModal(item.productId._id)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold mt-2"
                  >
                    Add to Cart
                  </button>
              </div>
            </div>
          ))}
        </div>
      </main>

{/* Category Slider */}
{/* Category Slider */}
<section className="mt-20 relative bg-gradient-to-r from-blue-50 to-blue-100 py-12 flex justify-center items-center">
  <h2 className="mb-14 absolute top-4 text-3xl font-bold text-blue-700 text-center">
    Browse Categories
  </h2>
  <div className="w-1/2 overflow-hidden relative mt-10">
    {/* Sliding container */}
    <div className="flex space-x-6 animate-scroll">
      {categories.map((category) => (
        <button
          key={category._id}
          className="flex-shrink-0 bg-white shadow-lg rounded-lg p-6 w-48 h-48 flex flex-col justify-center items-center hover:scale-105 hover:bg-blue-50 transition-transform duration-300"
          onClick={() => navigate(`/home/products?category=${category._id}`)}
        >
          <div className="w-16 h-16 mb-4 bg-blue-200 rounded-full flex items-center justify-center">
            {/* Example: Placeholder Icon (Replace with category image if available) */}
            <span className="text-blue-700 font-bold text-lg">
              {category.categoryName[0]}
            </span>
          </div>
          <span className="font-medium text-gray-700 text-center">
            {category.categoryName}
          </span>
        </button>
      ))}
    </div>
  </div>
</section>



      {/* Modal for Product Details */}
      {showModal && productDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">{productDetails.name}</h3>
            <img
              src={productDetails.imageUrl}
              alt={productDetails.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <p className="text-gray-600 mb-2">Price: ${productDetails.price}</p>
            <p className="text-gray-600 mb-2">
              Description: {productDetails.description}
            </p>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Size:</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="border rounded-lg w-full p-2"
              >
                <option value="">Select Size</option>
                {productDetails.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Quantity:</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="border rounded-lg w-full p-2"
                min="1"
              />
            </div>
            <div className="flex justify-between">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

   <Footer/>

    </div>
  );
}

export default HomeIn;
