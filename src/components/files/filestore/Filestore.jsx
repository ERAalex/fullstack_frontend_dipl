import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import FileList from '../filelist/FileList';
import { clearUserSelectedAdmin } from '../../../store/auth/authReducer';
import { fetchFiles } from '../../../redux/filesActions';



const FileStore = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const keepSelectedUser = queryParams.get('keepSelectedUser') === 'True';
  const currentUserId = useSelector((state) => state.auth.userData?.userId); 


  // Clear selected user if keepSelectedUser is not 'True', in case if admin are using some user's interface
  useEffect(() => {
    if (!keepSelectedUser) {
      dispatch(clearUserSelectedAdmin());
      dispatch(fetchFiles(currentUserId));
    }
  }, [keepSelectedUser, dispatch]);

  return (
    <div className="file-store">
      <FileList />
    </div>
  );
};

export default FileStore;