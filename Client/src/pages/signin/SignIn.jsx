import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  const url = import.meta.env.VITE_SERVER_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
        setError('All fields are required');
        return;
    }

    try {
        setLoading(true);

        const response = await axios.post(`${url}/api/user/login`, formData);

        if (response.data.status === 'success') {
            toast.success(response.data.message, { position: 'top-right' });
            localStorage.setItem('authtoken', response.data.token);

            if (response.data.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/home');
            }
        } else {
            setError(response.data.message);
        }
    } catch (err) {
        console.error('Login error:', err);

        if (err.response && err.response.data) {
            setError(err.response.data.message || 'An error occurred');
        } else {
            setError('An error occurred. Please try again.');
        }
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6">Sign In</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={loading} // Disable input during submission
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            disabled={loading} // Disable input during submission
          />
        </div>
        <button
          type="submit"
          className={`w-full p-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} mb-4`}
          disabled={loading} // Disable button during submission
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            disabled={loading} // Prevent navigation during loading
          >
            Don't have an account?
          </button>
          <button
            type="button"
            onClick={() => navigate('/resetemailsend')}
            className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
            disabled={loading} // Prevent navigation during loading
          >
            Forgot Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
