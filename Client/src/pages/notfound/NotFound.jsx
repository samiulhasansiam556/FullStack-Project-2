import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="h-screen flex flex-col items-center justify-center">
    <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
    <p className="text-gray-600 mb-8">Oops! The page you're looking for doesn't exist.</p>
    <Link
      to="/"
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
    >
      Go Back Home
    </Link>
  </div>
);

export default NotFound;
