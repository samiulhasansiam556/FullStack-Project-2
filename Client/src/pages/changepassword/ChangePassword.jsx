import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function ChangePassword() {
    const [formData, setFormData] = useState({
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const url = import.meta.env.VITE_SERVER_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Input Validation
        if (!formData.password || !formData.password_confirmation) {
            setError('All fields are required');
            return;
        }

        if (formData.password !== formData.password_confirmation) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post(
                `${url}/api/user/changepassword`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authtoken')}`,
                    },
                }
            );

            if (response.data.status === 'success') {
                toast.success(response.data.message, { position: 'top-right' });
                navigate('/home'); // Redirect to home or any other desired page
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-6">Change Password</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">New Password</label>
                    <input
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Confirm New Password</label>
                    <input
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={formData.password_confirmation}
                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Change Password
                </button>
            </form>
        </div>
    );
}

export default ChangePassword;
