import { configureStore, combineReducers } from '@reduxjs/toolkit';
import filesReducers from './filesReducers';
import userReducers from './usersReducers';
import authReducer from '../store/auth/authReducer';
import { thunk } from 'redux-thunk'; 
import logger from 'redux-logger'; 

import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { persistStore, persistReducer } from 'redux-persist';


// I used it to not lose information on reload page, because is memory saved info. 
const persistConfig = {
  key: 'root', // The key for the root reducer in storage
  storage,     // Type of storage (localStorage in this case)
  whitelist: ['auth'] // Specify which reducers you want to persist
};


// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  files: filesReducers,
  user: userReducers,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk, logger),
});

export const persistor = persistStore(store);
export default store;
