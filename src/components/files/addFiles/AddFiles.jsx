import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { uploadFile } from '../../../redux/filesActions';

import './addFiles.css'

const AddFiles = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState(''); // New state for comment


  // File and Comment Change control
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value); 
  };


  // Upload file logic here
  const handleUpload = async () => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('comment', comment); // Append comment to formData

        dispatch(uploadFile(formData));

        // Reset file and comment states
        setFile(null);
        setComment('');
      } catch (error) {
        console.error('Error uploading file:', error.message);
      }
    }
  };

  return (
    <div className='file-upload-container'>
      <h2>Загрузить новый файл</h2>

      <input 
        className='file-input' 
        type="file" 
        onChange={handleFileChange} 
      />

      <textarea
        className='comment-input'
        placeholder='Add a comment...'
        value={comment}
        onChange={handleCommentChange}
      />

      <button className='upload-button' onClick={handleUpload}>Загрузить</button>
      
    </div>
  );
};

export default AddFiles;
