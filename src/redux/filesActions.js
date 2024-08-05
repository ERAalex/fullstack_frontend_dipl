import { fetchFilesSuccess, fetchFilesFailure } from './filesReducers';
import apiUrl from './apiConfig'

export const fetchFiles = (userId) => {
    return async (dispatch) => {
      try {

        console.log('-----FETCH----')
        
        const token = localStorage.getItem('authorization');
        const isAdmin = localStorage.getItem('isAdmin') === 'true'

        let url = `${apiUrl}/files/get_user_files/`;

        // if we get here userId, then it's admin that want to get some user files
        if (userId && isAdmin) {
          url = `${apiUrl}/files/get_specific_user_files/${userId}`;
        // if not, take current user id, to search his files
        } else {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
          url = `${apiUrl}/files/get_specific_user_files/${storedUserId}`;
        }
      }

        const response = await fetch(url, {
          headers: {
            'Authorization': token,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error fetching files: ${response.statusText}`);
        }

        const data = await response.json();
        dispatch(fetchFilesSuccess(data));
      } catch (error) {
        dispatch(fetchFilesFailure(error.message));
      }
    };
  };


  export const fetchAllUsersFiles = () => {
    return async () => {

      try {
        const token = localStorage.getItem('authorization');

        let url = `${apiUrl}/files/get_all_users_files/`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': token,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error fetching files: ${response.statusText}`);
        }

        const data = await response.json();
        return data

      } catch (error) {
        throw new Error(`Error fetching files: ${error.message}`);
      }
    };
  };



export const uploadFile = (formData) => {
    return async (dispatch) => {
      try {
        const token = localStorage.getItem('authorization');
        
        const response = await fetch(`${apiUrl}/files/upload-file/`, {
          method: 'POST',
          headers: {
            'Authorization': token,
          },
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`Error uploading file: ${response.statusText}`);
        }
  
        const data = await response.json();
        console.log('File uploaded successfully:', data);
        dispatch(fetchFiles());
      } catch (error) {
        console.error('Error uploading file:', error.message);
      }
    };
  };
  

// Function to handle file download
export const downloadFile = (fileId, fileName, fileType) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem('authorization');
      const response = await fetch(`${apiUrl}/files/download-file/${fileId}/`, {
        method: 'GET',
        headers: {
          'Authorization': token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download file');
      }
  
      // Create a Blob from the response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      // Use the provided fileName and fileType, or fallback to default values
      const downloadFileName = fileName + '.' + fileType || 'downloaded-file';

      // Create a link element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = downloadFileName;
      document.body.appendChild(link);
      link.click();
  
      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
  
      // Dispatch success action if needed
      dispatch({ type: 'DOWNLOAD_SUCCESS', fileId });
    } catch (error) {
      console.error('Error during file download:', error);
      dispatch({ type: 'DOWNLOAD_FAILURE', error: error.message });
    }
  };
};


// Function to change data of file
export const changeFile = (fileId, newName, newDescription) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem('authorization');
      const response = await fetch(`${apiUrl}/files/change-file/${fileId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ new_name: newName, new_description: newDescription }),
      });

      if (!response.ok) {
        throw new Error(`Error renaming file: ${response.statusText}`);
      }

      dispatch(fetchFiles());

      console.log('File renamed successfully');
    } catch (error) {
      console.error('Error renaming file:', error.message);
    }
  };
};

export const changeComment = (fileId, newComment) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem('authorization');
      const response = await fetch(`${apiUrl}/files/comment/${fileId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ new_comment: newComment }),
      });

      if (!response.ok) {
        throw new Error(`Error change comment: ${response.statusText}`);
      }

      dispatch(fetchFiles());

      console.log('Comment changed successfully');
    } catch (error) {
      console.error('Error changing comment:', error.message);
    }
  };
};

export const deleteFile = (fileId) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem('authorization');
      const response = await fetch(`${apiUrl}/files/delete-file/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token,
        },
      });

      if (!response.ok) {
        throw new Error(`Error deleting file: ${response.statusText}`);
      }

      dispatch(fetchFiles());
    } catch (error) {
      console.error('Error deleting file:', error.message);
    }
  };
};

export const copyLinkFile = (fileId) => {
  return async(dispatch) => {
    try {
      const token = localStorage.getItem('authorization');
      const response = await fetch(`${apiUrl}/files/generate-external-link/${fileId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
          },
        })
      if (!response.ok) {
        throw new Error(`Error generating special link: ${response.statusText}`);
      }
      const result = await response.json();
      const link = result.link;
      alert(`Специальная ссылка для скачивания: ${link}`);
    } catch (error) {
      console.error('Error sharing file:', error.message);
    }
  }
}

export const changeLinkSecurity = (fileId) => {
  return async(dispatch) => {
    try {
      const token = localStorage.getItem('authorization');
      const response = await fetch(`${apiUrl}/files/change-security-link/${fileId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
          },
        })
      if (!response.ok) {
        throw new Error(`Error generating special link: ${response.statusText}`);
      }
      alert(`Специальная ссылка изменена`);
    } catch (error) {
      console.error('Error sharing file:', error.message);
    }
  }
}


