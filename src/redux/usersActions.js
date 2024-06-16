import { fetchUsersSuccess, fetchUsersFailure } from './usersReducers';
import apiUrl from './apiConfig'



export const checkToken = async (navigate) => {
  /**
   * Asynchronously checks the validity of the authorization token stored in localStorage.
   * If the token is missing, undefined, or invalid, the user is redirected to the login page.
   *
   * @param {function} navigate - The navigation function to redirect the user.
   * @returns {Promise<{isValid: boolean, error?: string}>} - An object indicating whether the token is valid and any error message if applicable.
   *
   */
  try {
    const token = localStorage.getItem('authorization');

    if (token === 'undefined') {
      console.log('----token is undefined---');
      navigate('/login');
      return { isValid: false };
    }

    if (!token) {
      console.log('----undef---1--')
      navigate('/login');
    }

  } catch (error) {
    console.error('Error during token verification:', error);
    return { isValid: false, error: 'An unexpected error occurred during token verification.' };
  }
};



export const fetchUsers = () => {
    return async (dispatch) => {
      try {
        const token = localStorage.getItem('authorization');
        console.log(token)
        const response = await fetch(`${apiUrl}/api/users/get-users`, {
          headers: {
            'Authorization': token,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error fetching users: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Fetched data:', data)
        dispatch(fetchUsersSuccess(data));
      } catch (error) {
        dispatch(fetchUsersFailure(error.message));
      }
    };
  };




export const registerUser = async (formData) => {
    /**
   * Registers a new user with the provided form data.
   *
   * This function sends a POST request to the registration API endpoint with the user's
   * details. If the registration is successful, it returns an object indicating success.
   *
   * @async
   * @param {Object} formData - The form data containing user registration details.
   * @param {string} formData.username - The username of the new user.
   * @param {string} formData.password - The password of the new user.
   * @param {string} formData.email - The email address of the new user.

   also is added new model value - storage_path
   */

    try {
      const requestData = {
          username: formData.username,
          password: formData.password,
          email: formData.email,
      };
  
      const response = await fetch(`${apiUrl}/api/create-user/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        console.log('---json1----')
        const errorData = await response.json();
        console.log('---json2----')
        if (errorData.error) {
          return { success: false, error: errorData.error };
        } else {
          return { success: false, error: 'Произошла ошибка при регистрации' };
        }
      } else {
        console.log('User registered successfully');
        return { success: true };
      }
    } catch (error) {
      console.error('Error during registration:', error);
      return { success: false, error: 'An unexpected error occurred during registration.' };
    }
  };
  
export default registerUser;
  




export const login = async (formData) => {
    try {

      console.log('--1----')
      console.log(formData)
      console.log(JSON.stringify(formData))
      console.log('--2---')
      const response = await fetch(`${apiUrl}/api/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
  
      if (response.ok) {
        const userData = await response.json();
        // save token recived from backend
        console.log(userData)
        console.log(userData.refresh)
        localStorage.setItem('authorization', userData.authorization);
        localStorage.setItem('currentuser', userData.currentuser);
        localStorage.setItem('isAdmin', userData.isAdmin)
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, error: 'An unexpected error occurred during login.' };
    }
  };
  

export const logout = () => {
    return async (dispatch) => {
      try {
        const token = localStorage.getItem('authorization');
  
        const response = await fetch(`${apiUrl}/api/users/logout`, {
          method: 'GET',
          headers: {
            'Authorization': token,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error logging out: ${response.statusText}`);
        }
  
        dispatch({ type: 'LOGOUT_SUCCESS' });
        localStorage.removeItem('authorization');
      } catch (error) {
        console.error('Error logging out:', error.message);
      }
    };
  };

export const deleteUser = (userId) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem('authorization');
      const response = await fetch(`${apiUrl}/api/users/delete/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token,
        },
      });

      if (!response.ok) {
        throw new Error(`Error deleting user: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('User deleted successfully:', data);
      dispatch(fetchUsers());
    } catch (error) {
      console.error('User deleting file:', error.message);
    }
  }
};

export const changeStatus = (userId) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem('authorization');
      const response = await fetch(`${apiUrl}/api/users/status/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': token,
        },
      });

      if (!response.ok) {
        throw new Error(`Error change status user: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('User status changed successfully:', data);
      dispatch(fetchUsers());
    } catch (error) {
      console.error('User changing status:', error.message);
    }
  }
}
