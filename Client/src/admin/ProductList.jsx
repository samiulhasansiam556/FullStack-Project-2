import { useState, useEffect } from 'react';
import axios from 'axios';


const url = import.meta.env.VITE_SERVER_URL;

function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("authtoken");
        const response = await axios.get(`${url}/api/admin/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(Array.isArray(response.data) ? response.data : []);
    
      } catch (error) {
        setError('Failed to fetch products.');
        console.error(error);
      }
    };
    fetchProducts();
  }, []);
  console.log(products)
  const deleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem("authtoken");
      await axios.delete(`${url}/api/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
    } catch (error) {
      setError('Failed to delete product.');
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Products</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {products.length > 0 ? (
        <ul className="space-y-4">
          {products.map((product) => (
            <li key={product._id} className="flex items-center justify-between p-4 bg-gray-100 rounded-md">
              <div className="flex items-center space-x-4">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-16 h-24 object-cover rounded-md"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">{product.name}</h3>
                  <p className="text-gray-600">Category: {product.category?.categoryName|| 'N/A'}</p>
                  <p className="text-gray-600">Price: ${product.price}</p>
                  <p className="text-gray-500 text-sm">Added on: {new Date(product.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <button
                onClick={() => deleteProduct(product._id)}
                className="text-red-500 hover:text-red-700 font-semibold"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No products available</p>
      )}
    </div>
  );
}

export default ProductList;
