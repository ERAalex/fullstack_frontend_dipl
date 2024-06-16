import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [message, setMessage] = useState(location.state?.message);

  useEffect(() => {
    // Clear the message after 3 seconds after success registration. (look at RegistrationForm.jsx)
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
        // Update the browser history to remove the state
        navigate(location.pathname, { replace: true });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, navigate, location.pathname]);


  return (
    <div className='login-container'>
      <h2>Вход</h2>

      {/*message about good registration  */}
      {message && <div className="success-message">{message}</div>}

      <LoginForm />
      <p className='link-register'>
        Нет аккаунта? <Link to="/registration">Зарегистрируйтесь</Link>
      </p>
    </div>
  );
}

export default Login;
