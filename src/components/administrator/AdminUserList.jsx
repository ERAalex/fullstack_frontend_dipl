import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

import { fetchUsers, deleteUser } from '../../redux/usersActions';
import { fetchAllUsersFiles } from '../../redux/filesActions';
import ConfirmationModal from './modal_confirmation/ModalConfirmation';
import {parseFileSize} from '../utils';
import './usersList.css';


const UsersList = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);

  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const loadUsersAndFiles = async () => {
      await dispatch(fetchUsers());
      const filesData = await dispatch(fetchAllUsersFiles());

      setFiles(filesData);

      setLoading(false);
    };
    loadUsersAndFiles();
  }, [dispatch]);

  const handleDeleteRequest = (userId) => {
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

  const getUserFilesInfo = (userId) => {
    if (!Array.isArray(files)) {
        return { count: 0, totalSize: 0 };  // Return default values if files is not an array
      }
      
    const userFiles = files.filter(file => file.user === userId);
    // Calculate the total size of user files
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
                <td>{user.username}</td>
                <td>{count}</td>
                <td>{totalSize}</td>
                <td>{user.email}</td>
                <td>
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
    </div>
  );
};

export default UsersList;
