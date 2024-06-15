import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home () {
  return (
    <div className="home-container">
      <h1 className="title">Облачное хранилище данных</h1>
      <p className="description">created by E.R.A.</p>
      <Link to="/registration" className="link">Регистрация</Link>
      <br />
      <Link to="/login" className="link">Вход</Link>
    </div>
  );
}

export default Home;
