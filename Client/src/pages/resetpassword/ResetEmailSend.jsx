import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const ResetEmailSend = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  const url = import.meta.env.VITE_SERVER_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input Validation
    if (!email) {
      setError('Email field is required');
      return;
    }

    try {
      setLoading(true); // Disable further submissions

      // Post request to backend API
      const response = await axios.post(`${url}/api/user/send-reset-password-email`, { email });

      // Handle successful response
      if (response.data.status === 'success') {
        toast.success(response.data.message, { position: 'top-right' });
        navigate('/signin'); // Redirect to Sign In page
      } else {
        setError(response.data.message); // Display backend error message
      }
    } catch (err) {
      console.error('Reset email error:', err);

      // Handle cases where err.response is undefined
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'An error occurred');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false); // Re-enable the form after the request completes
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading} // Disable input during submission
          />
        </div>
        <button
          type="submit"
          className={`w-full p-2 rounded text-white ${
            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={loading} // Disable button during submission
        >
          {loading ? 'Sending...' : 'Send Password Reset Link'}
        </button>
      </form>
    </div>
  );
};

export default ResetEmailSend;
