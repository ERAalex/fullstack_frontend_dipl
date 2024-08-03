import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { checkToken } from '../redux/usersActions'; // Adjust the path as necessary


// This component protects routes that require authentication
const ProtectedRoute = () => {
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

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading spinner or message while verifying the token
  }

  return isAuthorized ? <Outlet /> : null; // Render the outlet if authorized, otherwise render nothing
};


export default ProtectedRoute;
