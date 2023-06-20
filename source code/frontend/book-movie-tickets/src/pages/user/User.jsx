import React, { useEffect } from 'react';
import "./User.scss";
import UserInfo from '../../components/user/userInfo/UserInfo';
import UserType from '../../components/user/userType/UserType';
import UserRank from '../../components/user/userRank/UserRank';
import UserPoint from '../../components/user/userPoint/UserPoint';
import { useDispatch, useSelector } from 'react-redux';
import { updatedChecked, updatedTitle } from '../../redux/global/GlobalSlice';


const User = () => {
  const listTitles = ["Thông tin user", "Loại quyền user", "Hạng user"]

  const dispatch = useDispatch();

  // redux -> check title and checked show title
  const title = useSelector(state => state.global.title);
  const checked = useSelector(state => state.global.checked);

  const handleOpenTitle = (item) => {
    dispatch(updatedTitle(item))
    dispatch(updatedChecked(true))

  }

  useEffect(()=>{
    const checkElement = document.querySelector(".user");
      if(checked) {
      checkElement.classList.remove("user-container");
      }
      else{
        checkElement.classList.add("user-container");

      }
  })
  
  return (
    <div className="user">
      {
        !checked ?
        listTitles.map((item,index) => (
          <button 
            key = {index} 
            className="user-btn"
            onClick={() => handleOpenTitle(item)}
          >
            {item}
          </button>
        ))
        
        : 

        (        
          (title === "Thông tin user" && <UserInfo />) ||
          (title === "Loại quyền user" && <UserType />) ||
          (title === "Hạng user" && <UserRank />) ||
          (title === "Điểm thưởng user" && <UserPoint />)
        )
      }
    </div>
  )
}

export default User