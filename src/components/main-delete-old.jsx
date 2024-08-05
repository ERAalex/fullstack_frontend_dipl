import { UlElem } from './elements/Elements'
import { UserData } from './usersData/UserData'
import { Outlet } from 'react-router-dom' 
import { useSelector } from 'react-redux'

export function Main() {

  const { isLogined, isAdmin } = useSelector(store => store.auth)
  
  const headerMenu = [
    {
      id: 1,
      text: 'Main',
      link: '/',
      admin: false
    },
    {
      id: 2,
      text: 'My files',
      link: '/files',
      admin: false
    },
    {
      id: 3,
      text: 'About Us',
      link: '/about',
      admin: false 
    },
    {
      id: 4,
      text: 'Users',
      link: '/users',
      admin: true
    }
  ];

  const userHeaderMenu = headerMenu.filter(li => !li.admin); 

  return (
    <>
      <header className={styles.header}>
        {isLogined?
        <UlElem liStyle={styles.liStyle} liList={isAdmin?headerMenu:userHeaderMenu} ulStyle={styles.ulStyle} />:
        <div/>
        }
        <UserData/>
      </header>
      <main>
        <Outlet/>
      </main>
    </>
  )
}
