import {Link, useNavigate} from 'react-router-dom';
import {useState} from "react";
import FileList from '../filelist/FileList'

const FileStore = () => {

  return (
    <div className="file-store">

        <FileList />
    </div>
  );
};

export default FileStore;