import { useState, useEffect } from 'react';
import axios from 'axios';

const url = import.meta.env.VITE_SERVER_URL;

function CategoryList() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('authtoken');
      try {
        const response = await axios.get(`${url}/api/admin/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const deleteCategory = async (categoryId) => {
    try {
      const token = localStorage.getItem('authtoken');
      await axios.delete(`${url}/api/admin/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(categories.filter((category) => category._id !== categoryId));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Categories</h2>
      <ul>
        {categories.length > 0 ? (
          categories.map((category) => (
            <li
              key={category._id}
              className="flex justify-between items-center p-4 bg-gray-100 rounded-lg mb-3 hover:bg-gray-200 transition-colors"
            >
              <span className="text-lg font-semibold text-gray-700">
                {category.categoryName}
              </span>
              <button
                onClick={() => deleteCategory(category._id)}
                className="px-3 py-1 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-600">No categories available</p>
        )}
      </ul>
    </div>
  );
}

export default CategoryList;
