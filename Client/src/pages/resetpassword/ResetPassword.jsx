import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const { id, token } = useParams(); // Extract id and token from the URL
  const [formData, setFormData] = useState({
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New loading state
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
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true); // Set loading state to true

    try {
      // Post request to backend API
      const response = await axios.post(`${url}/api/user/reset/${id}/${token}`, formData);

      // Handle successful password reset
      if (response.data.status === 'success') {
        toast.success(response.data.message, { position: 'top-right' });
        navigate('/signin'); // Redirect to the sign-in page after successful reset
      } else {
        // Handle error response from backend
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Password reset error:', err);

      // Handle cases where err.response is undefined
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'An error occurred');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false); // Set loading state back to false
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
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
        <button
          type="submit"
          className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
