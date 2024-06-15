import { Link } from 'react-router-dom'
import styles from './UserData.module.css'

export function LoginOut() {
  return (
    <div className={styles.inputBlock}>
      <Link to="/login">Войти</Link>
      <Link to="/registration">Регистрация</Link>
    </div>
  )
}
