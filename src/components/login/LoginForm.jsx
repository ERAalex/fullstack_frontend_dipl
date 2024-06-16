import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../redux/usersActions';
import { checkToken } from '../../redux/usersActions';
import { loginSuccess } from '../../redux/usersReducers';
import { useDispatch } from 'react-redux'

import './LoginForm.css';

const LoginForm = () => {
  const dispatch = useDispatch(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Name:', name, 'Value:', value);
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginResult = await login(formData);

    if (loginResult.success) {
      console.log('Login successfully');
      if (loginResult.isAdmin) {
        const isAdmin = true;
        dispatch(loginSuccess({ isAdmin }));
        // redirect to file page
        navigate('/files');
      } else {
        navigate('/files');
      }
    } else {
      setError(loginResult.error);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label>
        Логин:
        <input
          name="username"
          className="input-field-login-form"
          type="text"
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Пароль:
        <input
          name="password"
          className="input-field-login-form"
          type="password"
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <button type="submit" className="submit-button-login-form">
        Логин
      </button>
      {error && <div className="error-message">{error}</div>}
    </form>
  );
};

export default LoginForm;
