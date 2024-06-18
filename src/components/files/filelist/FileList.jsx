import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchFiles } from '../../../redux/filesActions';
import { useSelector, useDispatch } from 'react-redux';

import './filelist.css'

const FilesList = () => {
  const dispatch = useDispatch();
  const files = useSelector((state) => state.files.files);
  const loading = useSelector((state) => state.files.loading);
  const error = useSelector((state) => state.files.error);

  useEffect(() => {
      dispatch(fetchFiles(2));
  }, [dispatch, 2]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="files-list">
      {files.length === 0 ? (
        <div>No files found.</div>
      ) : (
        files.map((file) => (
          <div key={file.id} className="file-item">
            <div className="file-name">{file.name}</div>
            <div className="file-size">{file.size} bytes</div>
          </div>
        ))
      )}
    </div>
  );
};

export default FilesList;