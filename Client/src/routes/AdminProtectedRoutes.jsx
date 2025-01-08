import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminProtectedRoute = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const authToken = localStorage.getItem('authtoken');
        if (!authToken) throw new Error('No token');

        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/admin/check-admin`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        
        if (response.data.role === 'admin') {
          setIsAuthorized(true);
        } else {
          throw new Error('Not authorized');
        }
      } catch (error) {
        console.error('Authorization error:', error);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, []);

  if (loading) return <div>Loading...</div>;

  return isAuthorized ? <Outlet /> : <Navigate to="/signin" />;
};

export default AdminProtectedRoute;
