import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FileUpload from '../addFiles/AddFiles';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faLink } from '@fortawesome/free-solid-svg-icons';

import { fetchFiles, deleteFile, changeFile, copyLinkFile, changeLinkSecurity  } from '../../../redux/filesActions';

import './filelist.css'

const FilesList = () => {
  const dispatch = useDispatch();
  const files = useSelector((state) => state.files.files);
  const loading = useSelector((state) => state.files.loading);
  const error = useSelector((state) => state.files.error);

  const [newFileName, setNewFileName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingFileId, setEditingFileId] = useState(null);

  useEffect(() => {
      dispatch(fetchFiles());
  }, [dispatch, ]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleDelete = (fileId) => {
    dispatch(deleteFile(fileId));
  };


  // Function to handle file update
  const handleFileUpdate = (fileId) => {
    if (newFileName.trim() !== '' || newDescription.trim() !== '') {
      dispatch(changeFile(fileId, newFileName, newDescription));
      setNewFileName('');
      setNewDescription('');
      setEditingFileId(null);
    }
  };

  const handleEditClick = (fileId, currentName, currentDescription) => {
    setEditingFileId(fileId);
    setNewFileName(currentName);
    setNewDescription(currentDescription);
  };

  const handleCopyLink = (fileId) => {
    dispatch(copyLinkFile(fileId));
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return (
    <div className="files-list">
      {files.length === 0 ? (
        <div>No files found.</div>
      ) : (
        files.map((file) => (
            <div key={file.id} className="file-item">

              <FontAwesomeIcon
                icon={faTimes}
                className="delete-icon"
                onClick={() => handleDelete(file.id)}
              />

              {/* Edit file name and description */}
              {editingFileId === file.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={newFileName}
                  placeholder="New file name"
                  onChange={(e) => setNewFileName(e.target.value)}
                />
                <textarea
                  value={newDescription || ''} // Default to empty string if null
                  placeholder="New description"
                  onChange={(e) => setNewDescription(e.target.value)}
                />
                <button onClick={() => handleFileUpdate(file.id)}>Save</button>
              </div>
            ) : (
              <>
                <div className="file-description">File Name: {file.filename} {' '}
                  <button onClick={() => handleEditClick(file.id, file.filename, file.description)}>Edit</button>
                </div>
                <div className="file-description">File Description: {file.description}</div>
              </>
            )}

              <div className="file-description">File Type: {file.file_type}</div>
              <div className="file-description">File Size: {file.filesize} Mb</div>
              <div className="file-description">File Loaded: {formatDate(file.load_date)}</div>
              <div className="file-description">Total downloads: {file.total_downloads} </div>

            {/* Add Copy Link Button */}
            <div className="file-description">
              <button onClick={() => handleCopyLink(file.id)} className="copy-link-button">
                <FontAwesomeIcon icon={faLink} /> Copy Link
              </button>
            </div>

            {/* Add Delete Button */}
              <FontAwesomeIcon icon={faTimes} className="delete-icon" onClick={() => handleDelete(file.id)}/>

            </div>
        ))
      )}

      <FileUpload />
    </div>
  );
};

export default FilesList;