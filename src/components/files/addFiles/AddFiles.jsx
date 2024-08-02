import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { uploadFile } from '../../../redux/filesActions';


const AddFiles = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (file) {
      console.log('----file--is--')
      console.log(file)
      try {
        const formData = new FormData();
        formData.append('file', file);
        dispatch(uploadFile(formData));
        // reset file state
        setFile(null);
      } catch (error) {
        console.error('Error uploading file:', error.message);
      }
    }

  };

  return (
    <div className='file-upload-container'>
      <h2>Загрузить новый файл</h2>
      <input className='file-input' type="file" onChange={handleFileChange} />
      <button className='upload-button' onClick={handleUpload}>Загрузить</button>
    </div>
  );
};

export default AddFiles;
