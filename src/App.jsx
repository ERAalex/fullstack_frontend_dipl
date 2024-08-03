import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './components/homePage/HomePage';
import Login from './components/login/Login';
import Registration from './components/login/RegistrationForm'
import UsersList from './components/administrator/AdminUserList'

import FileStore from './components/files/filestore/Filestore'
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/header/Header';

import store from './redux/store'; // Import the Redux store
import { Provider } from 'react-redux';


function App() {
  return (
    <Provider store={store}>
    <Router>
      <div className="app-container">
        <Header />
        <div className="content">
        <Routes>
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/UsersList" element={<UsersList />} />
          <Route path="/files" element={<ProtectedRoute><FileStore /></ProtectedRoute>} />
          {/* <Route path="/files" element={<FileStore />}/> */}
          <Route path="/" element={<HomePage />} />
        </Routes>
        </div>
      </div>
    </Router>
    </Provider>
  );
}


export default App;
