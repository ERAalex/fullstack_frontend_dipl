import { configureStore, combineReducers } from '@reduxjs/toolkit';
import filesReducers from './filesReducers';
import userReducers from './usersReducers';
import { thunk } from 'redux-thunk'; // Use named import for redux-thunk
import logger from 'redux-logger'; // Make sure to install redux-logger if you haven't already

// Combine reducers
const rootReducer = combineReducers({
  files: filesReducers,
  user: userReducers,
});

// Configure store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk, logger),
});

export default store;