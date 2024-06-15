import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { setStorageId } from '../../store/auth/authReducer';

export function UlElem({liList, liStyle, ulStyle}) {

  const dispatch = useDispatch();
  const { userId } = useSelector(store => store.auth.userData)

  const hundleClick = (e) => {
    if (e.target.textContent === 'My files') {
      dispatch(setStorageId({userId}));
    }
  }

  const liElems = liList.map(liElem => 
    <li key={liElem.id} className={liStyle} > 
      <Link to={`${liElem.link}`} onClick={hundleClick}>{liElem.text}</Link> 
    </li>
    );
  return (
    <ul className={ulStyle}>
      {liElems}
    </ul>
  )
}
