import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { fetchUsers, deleteUser } from '../../redux/usersActions';
import ConfirmationModal from './modal_confirmation/ModalConfirmation';
import './usersList.css';

const UsersList = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      await dispatch(fetchUsers());
      setLoading(false);
    };
    loadUsers();
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

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="users-list">
      {users.length === 0 ? (
        <div>No users found.</div>
      ) : (
        users.map((user) => (
          <div key={user.id} className="user-item">
            <div className="user-name">{user.username}</div>
            <FontAwesomeIcon
              icon={faTimes}
              className="delete-icon"
              onClick={() => handleDeleteRequest(user.id)}
              title="Delete user"
            />
          </div>
        ))
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