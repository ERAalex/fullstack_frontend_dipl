import React from 'react';
import LoginForm from './LoginForm';
import { Link } from 'react-router-dom';
import './Login.css';

import RegistrationForm from './RegistrationForm.jsx'

const Registration = () => {
  return (
    <div className='registration-container'>
      <h2>Регистрация</h2>
      <RegistrationForm />
    </div>
  );
}

export default Registration;