import React from 'react';
import './index.css';
import { Provider } from 'react-redux';
import App from './App.jsx';
import store from './redux/store';


function MainApp() {
  return (

    <Provider store={store}>
        <App />
    </Provider>

  );
}


export default MainApp;
