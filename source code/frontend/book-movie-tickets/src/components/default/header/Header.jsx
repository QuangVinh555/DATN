import React from 'react';
import "./Header.scss";
import Logo from "../../../assets/image/logo.png";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getToken, updateAuth } from '../../../redux/auth/AuthSlice';
import { useState } from 'react';
import { LOCAL_STORAGE_TOKEN_NAME } from '../../../localStorage/localStorage';
import { ToastContainer, toast } from 'react-toastify';
import { loginGoogleSuccess, updateTokenGG } from '../../../redux/gooleLogin/GooleLoginSlice';

const Header = () => {
    const listTitles = [
        {
          name: 'Rạp chiếu',
          path: "./rapchieu"
        },
        {
          name: 'Lịch chiếu',
          path: "./lichchieu"
        },
        {
          name: 'Phim chiếu',
          path: "./phimchieu"
        },
        {
          name: 'Tin tức',
          path: "./tintuc"
        },
    
    ]

    const navigate = useNavigate();
    const handleSendBuyTicket = () => {
      navigate("/muave");
    }

    const dispatch = useDispatch();
    const handleLoginUser = () => {
      dispatch(updateAuth(1));
    }

    const token = useSelector(state => state.auth.token)
 
    const [openInfoUser, setOpenInfoUser] = useState(false);
    const handleInfoUser = () => {
      setOpenInfoUser(!openInfoUser);
    }

    const handleLogOut = () => {
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
      dispatch(updateAuth(0)); 
      toast.info(
        "Bạn đã đăng xuất !",
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        }      
      );  
      dispatch(getToken(""));
      dispatch(updateTokenGG(""));
      dispatch(loginGoogleSuccess(null));
      setOpenInfoUser(false);
      navigate("/")    
    }

    const handleHome = () => {
      navigate("/");
    }

    const handleMoveUserInfo = () => {
      navigate("/taikhoan");
    }
  return (
    <>
      <ToastContainer />
      <div className="header">
  
          <div className="header-logo">
            <img onClick={() => handleHome()} className="header-logo-img" src={Logo} alt="" />
            <div className="header-logo-2">
                <img src="https://static.mservice.io/fileuploads/svg/momo-file-221117104714.svg" alt="" />
                <span onClick={() => handleSendBuyTicket()}>Đặt vé xem phim</span>
            </div>
          </div>
          <div className="header-lists">
            <ul>
              {/* {
                listTitles.map((title,index) => (
                  <li key={index}>{title.name}</li>
                ))
              } */}
              <li style={{display: 'flex', alignItems: 'center'}}>
                <AccountCircleIcon className="header-user" />
                {
                  token === "" || token === null ? 
                  <span onClick={() => handleLoginUser()}>Đăng nhập</span>
                  :
                  // <span onClick={() =>handleInfoUser()}>{token?.Username}</span>
                  <span onClick={() =>handleInfoUser()}>{token?.name || token?.Username}</span>
                }
              </li>
                {
                  openInfoUser && (
                    <ul>
                      <li onClick = {() => handleMoveUserInfo()}>Thông tin tài khoản</li>
                      <li onClick={() => handleLogOut()}>Đăng xuất</li>
                    </ul>
                  )
                }
            </ul>
          </div>
      </div>
    </>
  )
}

export default Header