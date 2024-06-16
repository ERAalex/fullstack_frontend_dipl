import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registration.css';
import { registerUser } from '../../redux/usersActions.js'

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    console.log(formData)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!formData.username || !formData.email || !formData.password) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await registerUser(formData)

      if (response.success) {
        // navigate('/login');
        navigate('/login', { state: { message: 'Удачная регистрация! Вы можете войти.' } });
      } else {
        setError('Registration failed.');
      }

    } catch (error) {
      console.error('Error during registration:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className='registration-container'>
      <h2>Регистрация</h2>
      <form className="registration-form" onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Email:
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit" className="submit-button-registration-form">
          Register
        </button>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default RegistrationForm;
