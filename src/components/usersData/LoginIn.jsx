import styles from './UserData.module.css'

import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setLogout } from '../../store/auth/authReducer'

export function LoginIn( {userData} ) {

  const dispatch = useDispatch();

  const handleClick = () => {
    console.log('exit')
    dispatch(setLogout());
  }

  return (
    <div className={styles.blockUser}>
      <div className={styles.aboutUser}>
        <img src='https://cdn-icons-png.flaticon.com/512/149/149071.png' alt="user icon" className={styles.userIcon}/>
        <span>{userData.username}</span>
      </div>
      <Link to='/' onClick={handleClick}>Выйти</Link>
    </div>
  )
}
