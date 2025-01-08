import { useState } from 'react';
import axios from 'axios';

const url = import.meta.env.VITE_SERVER_URL;

function CategoryCreate({ onCategoryCreated }) {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

 

   
  const handleSubmit = async (e) => {
    const token = localStorage.getItem('authtoken');
    e.preventDefault();
    setError('');
    setSuccessMessage('');
  
    try {
      const response = await axios.post(
        `${url}/api/admin/categoriescreate`,
        { categoryName },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage(response?.data?.message || 'Category created successfully!');
      setCategoryName('');
      if (onCategoryCreated) onCategoryCreated(response.data); // Call callback function if provided
    } catch (err) {
      // Show the backend message if available, otherwise default message
      setError(err.response?.data?.message || 'Failed to create category. Please try again.');
      console.error('Error creating category:', err);
    }
  };
  

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-semibold mb-4">Create Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="categoryName" className="block font-medium text-gray-700">
            Category Name
          </label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter category name"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
        >
          Create Category
        </button>
      </form>
      {successMessage && <p className="mt-4 text-green-600">{successMessage}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}

export default CategoryCreate;
