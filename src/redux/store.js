import { configureStore, combineReducers } from '@reduxjs/toolkit';
import filesReducers from './filesReducers';
import userReducers from './usersReducers';
import authReducer from '../store/auth/authReducer';
import { thunk } from 'redux-thunk'; 
import logger from 'redux-logger'; 

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  files: filesReducers,
  user: userReducers,
});

// Configure store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk, logger),
});

export default store;