import { createSlice } from "@reduxjs/toolkit";
import { Cookies } from "react-cookie";

const cookies = new Cookies();
const refresh = cookies.get('refresh');
const username = cookies.get('username');
const isAdmin = cookies.get('isAdmin');
const email = cookies.get('email');
const userId = cookies.get('userId');

const initialState = {
  isLogined: refresh?true:false,
  isAdmin: isAdmin?isAdmin:false,
  storageId: null,
  storageName: null,
  tokenData: {
    access: '',
  },
  userData: {
    username: username?username:'',
    email: email?email:'',
    userId: userId?userId:0
  }
}

export const authReducer = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateTokensData: (state, action) => {
      return {
        ...state,
        isLogined: action.payload.status,
        tokenData: {
          access: action.payload.access,
        }
      }
    },
    setUserData: (state, action) => {
      return {
        ...state,
        isAdmin: action.payload.isAdmin,
        userData: {
          username: action.payload.username,
          email: action.payload.email,
          userId: action.payload.userId,
        }
      }
    },
    setStorageId: (state, action) => {
      return ({
        ...state,
        storageId: action.payload.id,
        storageName: action.payload.username
      })
    },
    setLogout: () => {
      cookies.remove('refresh');
      cookies.remove('username');
      cookies.remove('isAdmin');
      cookies.remove('email');
      cookies.remove('userId');
      return ({
        ...initialState,
        isLogined: false
      });
    }
  }
})

export const { updateTokensData, setUserData, setLogout, setStorageId } = authReducer.actions
export default authReducer.reducer;