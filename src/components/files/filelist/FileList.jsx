import React, { useState } from 'react';
import { useEffect } from 'react';
import { fetchFiles } from '../../../redux/filesActions';
import { useSelector, useDispatch } from 'react-redux';
import FileUpload from '../addFiles/AddFiles';

import './filelist.css'

const FilesList = () => {
  const dispatch = useDispatch();
  const files = useSelector((state) => state.files.files);
  const loading = useSelector((state) => state.files.loading);
  const error = useSelector((state) => state.files.error);

  useEffect(() => {
      dispatch(fetchFiles());
  }, [dispatch, ]);

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
              <div className="file-description">File Name: {file.filename}</div>
              <div className="file-description">File Size: {file.filesize} bytes</div>
              <div className="file-description">File Loaded: {file.load_date}</div>
              <div className="file-description">File Link: {file.external_download_link}</div>
            </div>
        ))
      )}

      <FileUpload />
    </div>
  );
};

export default FilesList;