import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaBars } from 'react-icons/fa';

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

function AdminNavBar() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [authUser, setAuthUser] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authtoken');
      try {
        const response = await axios.get(`${VITE_SERVER_URL}/api/user/loggeduser`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuthUser(response.data.user);
        localStorage.setItem('authuser', JSON.stringify(response.data.user));
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authtoken');
    localStorage.removeItem('authuser');
    navigate('/signin');
  };

  return (
    <nav className="bg-blue-400 text-white p-4 flex justify-between items-center">
      {/* Left Side: Website Name */}
      <h1 className="text-xl font-bold">My E-commerce</h1>

      {/* Right Side: Profile Icon and Logout */}
      <div className="flex items-center space-x-4">
        <button onClick={handleLogout} className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition">
          Logout
        </button>
        
        <button onClick={() => setIsProfileModalOpen(true)} className="focus:outline-none rounded-full overflow-hidden border-2 border-white">
          <img src={authUser.profileImage} alt="Profile" className="w-10 h-10 md:w-12 md:h-12 object-cover" />
        </button>

        {/* Mobile Menu Icon */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <FaBars size={24} />
        </button>
      </div>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Profile</h3>
            <div className="flex items-center mb-4">
              <img src={authUser.profileImage} alt="Profile" className="w-20 h-20 rounded-full object-cover mr-4 border-2" />
              <div>
                <p className="text-l text-black font-bold">{authUser.name || 'Guest'}</p>
                <p className="text-gray-600">{authUser.email || 'N/A'}</p>
              </div>
            </div>
            <button onClick={() => navigate('/home/editprofile')} className="bg-blue-500 py-2 px-4 rounded w-full mb-2">
              Edit Profile
            </button>
            <button onClick={() => navigate('/home/changepassword')} className="bg-blue-500 text-white py-2 px-4 rounded w-full">
              Change Password
            </button>
            <button onClick={() => setIsProfileModalOpen(false)} className="mt-4 text-gray-600">Close</button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default AdminNavBar;
