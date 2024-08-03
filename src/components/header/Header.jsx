import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../redux/usersActions';
import { checkToken } from '../../redux/usersActions'; 

import './HeaderStyle.css';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const { isValid } = await checkToken(navigate);
      setIsAuthorized(isValid);
      setIsLoading(false);
    };

    verifyToken();
  }, [navigate]);

  const handleLogout = () => {
    dispatch(logout(navigate));
    setIsAuthorized(false);
    navigate('/login'); // Redirect to login page after logout
  };

  if (isLoading) {
    return <div>Loading...</div>; // Optional: show loading while checking the token
  }

  return (
    <header className="header">
      <nav className="nav-headers">
        <Link to="/">Home</Link>
        {isAuthorized ? (
          <>
            <Link to="/files">Files</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/registration">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
