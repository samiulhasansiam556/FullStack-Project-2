

// import { Navigate,Outlet} from 'react-router-dom';

// const ProtectedRoute = ({ children }) => {

//   const authToken = localStorage.getItem("authtoken");

  
//   if (authToken) {
//     return <Outlet />;
//   } else {
//     return <Navigate to="/SingIn" />;
//   }
// };

// export default ProtectedRoute;


import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const authToken = localStorage.getItem('authtoken');

  useEffect(() => {
    const verifyToken = async () => {
      if (!authToken) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        // Check if the token is valid by making a request to a protected route
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/user/loggeduser`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },

        });
    
        localStorage.setItem("authuser",JSON.stringify(response.data.user))

        if (response.data.user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('authtoken');
        }
      } catch (err) {
        console.error('Token verification failed:', err);
        setIsAuthenticated(false);
        localStorage.removeItem('authtoken');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [authToken]);

  if (loading) {
    return <div>Loading...</div>; // Optionally show a loading spinner while verifying
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;
