import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './components/homePage/HomePage';
import Login from './components/login/Login';
import Registration from './components/login/RegistrationForm'

import FileStore from './components/files/filestore/Filestore'
import AddFiles from './components/files/addFiles/AddFiles'


import store from './redux/store'; // Import the Redux store
import { Provider } from 'react-redux';


function App() {
  return (
    <Provider store={store}>
    <Router>
      <div>
        <Routes>
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/files" element={<FileStore />} />
          <Route path="/" element={<HomePage />} />

        </Routes>
      </div>
    </Router>
    </Provider>
  );
}


export default App;
