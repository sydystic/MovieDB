// src/components/NotFound.tsx
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center text-white py-20">
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="mb-4">Sorry, the page you're looking for doesn't exist.</p>
      <Link to="/" className="text-blue-400 hover:underline">
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFound;
