import { useSelector } from 'react-redux'
import styles from './UserData.module.css'
import { LoginIn } from './LoginIn' 
import { LoginOut } from './LoginOut'

export function UserData() {

  const { userData, isLogined } = useSelector(store => store.auth)

  return (
    <div>
      { isLogined ? <LoginIn userData={userData}/> : <LoginOut/>}
    </div>
  )
}
