import { fetchUsersSuccess, fetchUsersFailure } from './usersReducers';
import { setLogout, setUserData } from '../store/auth/authReducer';
import apiUrl from './apiConfig'


export const checkToken = async (navigate) => {
  /**
   * Checks the validity of the authorization token stored in localStorage
   */

  try {
    let token = localStorage.getItem('authorization');
    console.log('Authorization token:', token);

    // Remove 'Bearer ' prefix if present
    if (token && token.startsWith('Bearer ')) {
        token = token.substring(7);
    }

    if (!token || token === 'undefined') {
      console.log('Token is undefined or missing');
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
        return { isValid: false };
      }
      
      // Handle other possible errors
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


export const fetchUsers = () => {
    return async (dispatch) => {
      try {
        const token = localStorage.getItem('authorization');

        const response = await fetch(`${apiUrl}/api/users/`, {
          headers: {
            'Authorization': token,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error fetching users: ${response.statusText}`);
        }
        
        const data = await response.json();
        dispatch(fetchUsersSuccess(data));
      } catch (error) {
        dispatch(fetchUsersFailure(error.message));
      }
    };
  };


export const registerUser = async (formData) => {

    try {
      const requestData = {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          isAdmin: formData.isAdmin,
      };
  
      if (formData.isAdmin) {
        requestData.code = '123456'; // Example code, can be set from an environment variable or other secure source
      }

      const endpoint = formData.isAdmin ? `${apiUrl}/api/create-admin/` : `${apiUrl}/api/create-user/`;

      const response = await fetch(endpoint, {
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


  // * LOGIN PART * //

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

        // save token
        localStorage.setItem('authorization', `Bearer ${userData.access}`);
        localStorage.setItem('refresh_token', `Bearer ${userData.refresh}`);

      // Now get information about account
      const accountDataResult = await accountinfo();

      // proceed and return True to pass to /files
      if (accountDataResult.success) {
        console.log('-----LOGIN-----')
        return { success: true, data: accountDataResult.data };
      } else {
        return { success: false, error: accountDataResult.error };
      }
    } else {
      if (response.status === 401) {
        // Show alert for unauthorized access
        alert('Unauthorized: Please check your username and password.');
      }
      
      const errorData = await response.json();
      return { success: false, error: errorData.error };
    }
  } catch (error) {
    console.error('Error during login:', error);
    return { success: false, error: 'An unexpected error occurred during login.' };
  }
};


export const accountinfo = async () => {
    /**
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
        localStorage.setItem('isAdmin', userData.is_admin)
        return { success: true, data: userData };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, error: 'An unexpected error occurred during login.' };
    }
  };


  export const logout = (navigate) => {
    return async (dispatch) => {
      try {
        const token = localStorage.getItem('authorization'); // Access token
        const refreshToken = localStorage.getItem('refresh_token'); // Refresh token

        // Ensure both tokens are available
        if (!token || !refreshToken) {
          throw new Error('Authorization or refresh token missing');
        }
  
        const response = await fetch(`${apiUrl}/api/logout`, {
          method: 'POST',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json', // Send JSON data
          },
          body: JSON.stringify({ refresh: refreshToken }), // Send refresh token in body
        });
  
        if (!response.ok) {
          console.error(`Error logging out: ${response.statusText}`);
        }
        
        console.log('-----LOGOUT-----')
        dispatch(setLogout());

        localStorage.removeItem('authorization');
        localStorage.removeItem('refresh_token'); // Also remove refresh token
        localStorage.removeItem('isAdmin'); 
        
        // Redirect to the main page or login page
        navigate('/');
      } catch (error) {
        console.error('Error logging out:', error.message);
      }
    };
  };


export const deleteUser = (userId) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem('authorization');
      const response = await fetch(`${apiUrl}/api/delete-user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token,
        },
      });

      // Check if the response status is 204, which means no content
      if (response.status === 204) {
        console.log('User deleted successfully');
      } else {
        // If there is content, parse it
        const data = await response.json();
        console.log('User deleted successfully:', data);
      }

      // const data = await response.json();
      // console.log('User deleted successfully:', data);
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
      const response = await fetch(`${apiUrl}/api/change-user-status/${userId}`, {
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
