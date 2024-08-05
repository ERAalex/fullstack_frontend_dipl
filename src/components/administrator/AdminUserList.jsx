
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faShieldAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import { fetchUsers, deleteUser, changeStatus } from '../../redux/usersActions';
import { fetchAllUsersFiles } from '../../redux/filesActions';
import ConfirmationModal from './modal_confirmation/ModalConfirmation';
import NotificationModal from '../utils-instruments/utils';

import InformationModal from '../info/Info';
import { adminUserListInfo } from '../info/Info';

import FileList from '../files/filelist/FileList';

import {parseFileSize} from '../utils-instruments/utils';
import './usersList.css';


const UsersList = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);

  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [files, setFiles] = useState([]);


  const [selectedUserId, setSelectedUserId] = useState(null); // State for selected user ID

  const currentUserId = useSelector((state) => state.auth.userData?.userId); 
  console.log(currentUserId)


  useEffect(() => {
    const loadUsersAndFiles = async () => {
      await dispatch(fetchUsers());
      const filesData = await dispatch(fetchAllUsersFiles());

      setFiles(filesData);

      setLoading(false);
    };
    loadUsersAndFiles();
  }, [dispatch]);


  // Delete logic for modal
  const handleDeleteRequest = (userId) => {
    if (userId === currentUserId) {
      setNotificationMessage("You cannot delete your own account.");
      setNotificationVisible(true);
      return;
    }
    setUserIdToDelete(userId);
    setModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (userIdToDelete) {
      await dispatch(deleteUser(userIdToDelete));
      setUserIdToDelete(null);
    }
    setModalVisible(false);
  };

  const handleDeleteCancel = () => {
    setUserIdToDelete(null);
    setModalVisible(false);
  };


  // Handle admin status toggle
  const handleAdminStatusToggle = (userId) => {
    if (userId === currentUserId) {
      setNotificationMessage("You cannot change your own admin status.");
      setNotificationVisible(true);
      return;
    }
    dispatch(changeStatus(userId));
  };


// Handle notification close
  const handleNotificationClose = () => {
    setNotificationVisible(false);
  };



  // Handle user selection SHOW and NOT TO SHOW
  const handleUsernameClick = (userId) => {
    // Toggle the selected user ID
    setSelectedUserId(prevId => (prevId === userId ? null : userId));
  };



  // Calculate the total size of user files -> size + total
  const getUserFilesInfo = (userId) => {
    if (!Array.isArray(files)) {
        return { count: 0, totalSize: 0 };  // Return default values if files is not an array
      }
      
    const userFiles = files.filter(file => file.user === userId);
    const totalSize = userFiles.reduce((acc, file) => acc + parseFileSize(file.filesize), 0);

    return {
      count: userFiles.length,
      totalSize
    };
  };

  if (loading) {
    return <div>Loading users...</div>;
  }


  return (
    <div>

      {/* information modal for admin */}
      <button className="info-button" onClick={() => setInfoModalVisible(true)}>
        <FontAwesomeIcon icon={faInfoCircle} /> Admin Info
      </button>

    <div className="users-list-container">
      {users.length === 0 ? (
        <div>No users found.</div>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Total files</th>
              <th>Total size</th>
              <th>Email</th>
              <th>Is Admin</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const { count, totalSize } = getUserFilesInfo(user.id);
              return (
                
              <tr key={user.id}>
              
                <td
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleUsernameClick(user.id)}
                >
                  {user.username} 
                </td>


                <td>{count}</td>
                <td>{totalSize}</td>
                <td>{user.email}</td>
                <td
                    onClick={() => handleAdminStatusToggle(user.id)}
                    style={{ cursor: 'pointer' }}
                    title="Click to toggle admin status"
                  >
                    {user.is_staff ? (
                      <FontAwesomeIcon icon={faShieldAlt} title="Admin" className="admin-icon" />
                    ) : (
                      'No'
                    )}
                  </td>
                
                <td className="delete-cell">
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="delete-user-icon"
                    onClick={() => handleDeleteRequest(user.id)}
                    title="Delete user"
                  />
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      )}
      <ConfirmationModal
        show={modalVisible}
        message="Are you sure you want to delete this user?"
        onConfirm={handleDeleteConfirm}
        onClose={handleDeleteCancel}
      />
      <NotificationModal
        show={notificationVisible}
        message={notificationMessage}
        onClose={handleNotificationClose}
      />
      <InformationModal
        show={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
        content={adminUserListInfo} 
      />
    </div>

      <br></br>
      {/* Render FilesList if a user is selected */}
      {selectedUserId && (
        <FileList userId={selectedUserId} />
      )}

  </div>
  );
};

export default UsersList;
