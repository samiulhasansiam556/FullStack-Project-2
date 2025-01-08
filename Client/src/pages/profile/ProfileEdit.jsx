// ProfileEdit.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'
const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

const ProfileEdit = () => {
  const [formData, setFormData] = useState({

    name: '',
    username: '',
    phone: '',
    address: '',
    image: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('authuser')) || {};
    setFormData({
      name: user.name || '',
      username: user.username || '',
      phone: user.phone || '',
      address: user.address || '',
      image: null,
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append('name', formData.name);
    data.append('username', formData.username);
    data.append('phone', formData.phone);
    data.append('address', formData.address);
    data.append('image', formData.image);
  
    const token = localStorage.getItem('authtoken');
  
    try {
      const response = await axios.post(`${VITE_SERVER_URL}/api/user/updateuser`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        localStorage.setItem('authuser', JSON.stringify(response.data.user));
        toast.success('Profile updated successfully!',{position:'top-right'});
        navigate('/home');
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.success(error.response.data.message,{position:'top-right'});  // Display backend error message (e.g., 'Username already exists')
      } else {
        toast.success('There was an error updating the profile.',{position:'top-right'});
      }
      console.error('Error updating profile:', error);
    }
  };
 

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mt-12 mx-auto p-8 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Phone:</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Profile Image:</label>
        <input
          type="file"
          name="image"
          onChange={handleFileChange}
          accept="image/*"
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <button type="submit" className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600">
        Save Changes
      </button>
    </form>
  );
};

export default ProfileEdit;