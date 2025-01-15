import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { FaShoppingCart, FaBars } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

function NavIn() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authUser, setAuthUser] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
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

  useEffect(() => {
    setIsProfileModalOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('authtoken');
    localStorage.removeItem('authuser');
    navigate('/signin');
  };

  const handleSearch = () => {
    navigate(`/home/search/${searchTerm}`);
  };

  return (
    <div className="bg-blue-700 p-4 shadow-md z-50  right-0 top-0 left-0">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-8">
        <div className="text-white text-2xl font-bold">E-Commerce</div>

     

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/home" className="text-white">Home</Link>
          <Link to="/home/products" className="text-white">Products</Link>
          <Link to="/home/order" className="text-white">Order</Link>
          <Link to="/home/contact" className="text-white">Contact</Link>
          <Link to="/home/about" className="text-white">About</Link>

          {/* Search Bar */}
          <div className="flex items-center border rounded overflow-hidden">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-2 py-1 focus:outline-none"
            />
            <button onClick={handleSearch} className="bg-blue-600 text-white px-3">
              Search
            </button>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
          
          {/* Profile Icon */}
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="focus:outline-none rounded-full overflow-hidden border-2 border-white"
          >
            <img
              src={authUser.profileImage}
              alt="Profile"
              className="w-10 h-10 md:w-12 md:h-12 object-cover"
            />
          </button>
        </div>

           {/* Cart Icon */}
           <button onClick={() => navigate('/home/cart')} className="text-white mr-4 md:mr-0">
          <FaShoppingCart size={20} />
        </button>

        {/* Mobile Menu Icon */}
        <button onClick={() => setIsMenuOpen(true)} className="md:hidden text-white">
          <FaBars size={24} />
        </button>
      </div>

      {/* Mobile Menu Modal */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-80">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-sm">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4 text-gray-600"
            >
              <MdClose size={24} />
            </button>
            <nav className="flex flex-col space-y-4 mt-10">
              <Link to="/home" onClick={() => setIsMenuOpen(false)} className="text-gray-800">Home</Link>
              <Link to="/home/products" onClick={() => setIsMenuOpen(false)} className="text-gray-800">Products</Link>
              <Link to="/home/order" >Order</Link>
              <Link to="/home/contact" onClick={() => setIsMenuOpen(false)} className="text-gray-800">Contact</Link>
              <Link to="/home/about" onClick={() => setIsMenuOpen(false)} className="text-gray-800">About</Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white font-semibold py-2 px-4 rounded mt-2"
              >
                Logout
              </button>
              <button
                onClick={() => { setIsProfileModalOpen(true); setIsMenuOpen(false); }}
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded mt-2"
              >
                Profile
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="relative bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Profile</h3>
            <div className="flex items-center mb-4">
              <img
                src={authUser.profileImage}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover mr-4 border-2"
              />
              <div>
                <p className="text-lg font-bold">{authUser.name || 'Guest'}</p>
                <p className="text-gray-600">{authUser.email || 'N/A'}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/home/editprofile')}
              className="bg-gray-200 py-2 px-4 rounded w-full mb-2"
            >
              Edit Profile
            </button>
            <button
              onClick={() => navigate('/home/changepassword')}
              className="bg-blue-500 text-white py-2 px-4 rounded w-full"
            >
              Change Password
            </button>
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600"
            >
              <MdClose size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NavIn;
