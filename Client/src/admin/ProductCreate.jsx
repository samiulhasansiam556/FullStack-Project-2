import { useState, useEffect } from 'react';
import axios from 'axios';

const url = import.meta.env.VITE_SERVER_URL;

function ProductCreate() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [sizeOptions] = useState(['S', 'M', 'L', 'XL', 'XXL']); // Available sizes
  const [sizes, setSizes] = useState([]); // Track selected sizes
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authtoken');
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${url}/api/admin/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSizeChange = (size) => {
    setSizes((prevSizes) =>
      prevSizes.includes(size) ? prevSizes.filter((s) => s !== size) : [...prevSizes, size]
    );
  };

  const handleCreate = async () => {
    if (!name || !price || !category || !image) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('authtoken');
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('sizes', sizes.join(',')); // Convert array to string
    formData.append('image', image);

    try {
      await axios.post(`${url}/api/admin/productscreate`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Product created successfully!');
      setName('');
      setPrice('');
      setCategory('');
      setSizes([]);
      setImage(null);
    } catch (err) {
      setError('Error creating product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Create Product</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className="w-full text-gray-700 bg-white px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id} className="text-gray-700 bg-white">
            {cat.categoryName}
          </option>
        ))}
      </select>

      {/* Size checkboxes */}
      <div className="mb-4">
        {sizeOptions.map((size) => (
          <label key={size} className="mr-3 text-gray-700">
            <input
              type="checkbox"
              value={size}
              checked={sizes.includes(size)}
              onChange={() => handleSizeChange(size)}
              className="mr-1"
            />
            {size}
          </label>
        ))}
      </div>

      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        required
        className="w-full mb-4"
      />

      <button
        onClick={handleCreate}
        disabled={loading}
        className={`w-full py-2 px-4 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} transition-all`}
      >
        {loading ? 'Creating...' : 'Create Product'}
      </button>
    </div>
  );
}

export default ProductCreate;
