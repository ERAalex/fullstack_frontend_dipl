import { fetchUsersSuccess, fetchUsersFailure } from './usersReducers';
import apiUrl from './apiConfig'



export const checkToken = async (navigate) => {
  /**
   * Asynchronously checks the validity of the authorization token stored in localStorage
   */

  try {
    const token = localStorage.getItem('authorization');
    console.log('Authorization token:', token);

    if (!token || token === 'undefined') {
      console.log('Token is undefined or missing');
      navigate('/login');
      return { isValid: false };
    }

    const response = await fetch(`${apiUrl}/api/token/verify/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const responseData = await response.json();
      console.log('Token verification response:', responseData);
      
      // Check for invalid token response
      if (responseData.detail === 'Token is invalid or expired' || responseData.code === 'token_not_valid') {
        navigate('/login');
        return { isValid: false };
      }
      
      // Handle other possible errors
      navigate('/login');
      return { isValid: false, error: responseData.detail || 'Token verification failed' };
    }

    // Token is valid
    return { isValid: true };

  } catch (error) {
    console.error('Error during token verification:', error);
    navigate('/login'); // Redirect to login on error
    return { isValid: false, error: 'An unexpected error occurred during token verification.' };
  }
};


// export const checkToken = async (navigate) => {
//   /**
//    * Asynchronously checks the validity of the authorization token stored in localStorage.

//    */
//   try {
//     const token = localStorage.getItem('authorization');
//     console.log(token)
//     console.log('-----TOKEN----')
//     if (token === 'undefined') {
//       console.log('----token is undefined---');
//       navigate('/login');
//       return { isValid: false };
//     }

//     if (!token) {
//       console.log('----undef---1--')
//       navigate('/login');
//     }

//   } catch (error) {
//     console.error('Error during token verification:', error);
//     return { isValid: false, error: 'An unexpected error occurred during token verification.' };
//   }
// };



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
        const errorData = await response.json();

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
      console.error('Произошла ошибка при регистрации:', error);
      return { success: false, error: 'Неожиданная ошибка в процессе регистрации.' };
    }
  };



export const login = async (formData) => {
    try {

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

        console.log(userData)
        console.log(userData.access)
        // save token
        localStorage.setItem('authorization', `Bearer ${userData.access}`);

      // Now get information about account
      const accountDataResult = await accountinfo();

      // proceed and return True to pass to /files
      if (accountDataResult.success) {
        return { success: true };
      } else {
        return { success: false, error: accountDataResult.error };
      }
    } else {
      const errorData = await response.json();
      return { success: false, error: errorData.error };
    }
  } catch (error) {
    console.error('Error during login:', error);
    return { success: false, error: 'An unexpected error occurred during login.' };
  }
};


  //       localStorage.setItem('currentuser', userData.currentuser);
  //       localStorage.setItem('isAdmin', userData.isAdmin)
  //       return { success: true };
  //     } else {
  //       const errorData = await response.json();
  //       return { success: false, error: errorData.error };
  //     }
  //   } catch (error) {
  //     console.error('Error during login:', error);
  //     return { success: false, error: 'An unexpected error occurred during login.' };
  //   }
  // };
  //

export const accountinfo = async () => {
    /**
   * Fetches the account information of the currently authenticated user.
   *
   * This function sends a GET request to the `/api/data-user/` endpoint to retrieve
   * the user's account information. The request includes the authorization token
   * stored in localStorage.
   *
   * @async
   * this method is used in 'login'
   */

    try {
      const token = localStorage.getItem('authorization')

      const response = await fetch(`${apiUrl}/api/data-user/`, {
          method: 'GET',
          headers: {
            'Authorization': token,
          },
        });

      if (response.ok) {
        const userData = await response.json();

        // now get information about account
        localStorage.setItem('userId', userData.id);
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
