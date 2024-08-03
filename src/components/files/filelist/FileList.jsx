import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FileUpload from '../addFiles/AddFiles';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { fetchFiles, deleteFile, renameFile  } from '../../../redux/filesActions';

import './filelist.css'

const FilesList = () => {
  const dispatch = useDispatch();
  const files = useSelector((state) => state.files.files);
  const loading = useSelector((state) => state.files.loading);
  const error = useSelector((state) => state.files.error);

  const [newFileName, setNewFileName] = useState('');
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


  const handleNameChange = (fileId) => {
    if (newFileName.trim() !== '') {
      dispatch(renameFile(fileId, newFileName));
      setNewFileName('');
      setEditingFileId(null);
    }
  };

  const handleEditClick = (fileId, currentName) => {
    setEditingFileId(fileId);
    setNewFileName(currentName);
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

                {editingFileId === file.id ? (
                <>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                />
                
                <button onClick={() => handleNameChange(file.id)}> Save </button>
                </>
                ) : (
                <div className="file-description">File Name: {file.filename}{' '}
                  <button onClick={() => handleEditClick(file.id, file.filename)}> Edit </button>
                </div>
                )}

              <div className="file-description">File Size: {file.filesize} bytes</div>
              <div className="file-description">File Loaded: {file.load_date}</div>
              <div className="file-description">File Link: {file.external_download_link}</div>

              {/* <button className="delete-button" onClick={() => handleDelete(file.id)}>
                  Delete
              </button> */}

              <FontAwesomeIcon icon={faTimes} className="delete-icon" onClick={() => handleDelete(file.id)}/>

            </div>
        ))
      )}

      <FileUpload />
    </div>
  );
};

export default FilesList;