import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkToken } from '../redux/usersActions'; 


// This component protects routes that require authentication
const ProtectedRoute = ({ children }) => {
    /**
     * `ProtectedRoute` Component
     *
     * Purpose:
     * The `ProtectedRoute` component is designed to protect specific routes within a React application 
     * by ensuring that users are authenticated before accessing those routes. It performs a token 
     * verification check and conditionally renders the protected content based on the authentication status.
     * 
  */

  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const { isValid } = await checkToken(navigate);
      setIsAuthorized(isValid);
      setIsLoading(false);
    };

    verifyToken();
  }, [navigate]);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthorized) {
        // Render the children or `Outlet` if authorized
        return;
      } else {
        // Redirect to login page if not authorized
        
        navigate('/login', { state: { from: location } });
      }
    }
  }, [isLoading, isAuthorized, navigate, location]);

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading spinner or message while verifying the token
  }

  return isAuthorized ? children : null; // Render children if authorized, otherwise render nothing
};

export default ProtectedRoute;
