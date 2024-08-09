import React, { useState } from 'react';
import '../../login/Registration.css';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../../redux/usersActions';

const AdminUserRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    isAdmin: false,
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkbox separately
    if (type === 'checkbox') {
      setFormData((prevData) => ({ ...prevData, [name]: checked }));
      return;
    }

    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
      const response = await registerUser(formData);

      if (response.success) {
        alert('User registration successful!');
        window.location.reload();
      } else {
        alert('User registration failed!');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className='registration-container'>
      <h2>Registration</h2>
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
        <label>
          Administrator:
          <input
            name="isAdmin"
            type="checkbox"
            checked={formData.isAdmin}
            onChange={handleChange}
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

export default AdminUserRegistration;
