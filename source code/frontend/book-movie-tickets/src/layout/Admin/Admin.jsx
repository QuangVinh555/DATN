import React, { useEffect, useState } from 'react';
import "./Admin.scss";
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/image/logo.png';
import noAvatar from '../../assets/image/noAvatar.png';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import TheatersIcon from '@mui/icons-material/Theaters';
import MovieIcon from '@mui/icons-material/Movie';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import FeedIcon from '@mui/icons-material/Feed';
import BarChartIcon from '@mui/icons-material/BarChart';
import WidgetsIcon from '@mui/icons-material/Widgets';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { useDispatch, useSelector } from 'react-redux';
import { updatedChecked, updatedTitle } from '../../redux/global/GlobalSlice';
import { ToastContainer, toast } from 'react-toastify';
import { LOCAL_STORAGE_TOKEN_NAME } from '../../localStorage/localStorage';
import { getToken, updateAuth } from '../../redux/auth/AuthSlice';
import { loginGoogleSuccess, updateTokenGG } from '../../redux/gooleLogin/GooleLoginSlice';
const Admin = () => {
  const listTitles = [
    {
      name: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard'
    },
    {
      name: 'Quản lý user',
      icon: <PeopleAltIcon />,      
      path: '/user'
    },
    {
      name: 'Quản lý rạp phim',
      icon: <TheatersIcon />,      
      path: '/movietheater'
    },
    {
      name: 'Quản lý phim',
      icon: <MovieIcon />,      
      path: '/movies'
    },
    {
      name: 'Quản lý suất chiếu',
      icon: <VideoCameraFrontIcon />,      
      path: '/showtimes'
    },
    {
      name: 'Quản lý vé',
      icon: <BookOnlineIcon />,      
      path: '/tickets'
    },
    {
      name: 'Quản lý tin tức',
      icon: <FeedIcon />,      
      path: '/news'
    },
    {
      name: 'Thống kê',
      icon: <BarChartIcon />,      
      path: '/statistical'
    },
  ];
  const dispatch = useDispatch();

  // redux -> check subtitle and checked show subtitle
  const subtitle = useSelector(state => state.global.title);

  // chuyển trang theo title menu
  const [title, setTitle] = useState();
  const location = useLocation();
  const navigate = useNavigate();
  const handleClick = (item) => {
    navigate(item.path);
    dispatch(updatedTitle(""))
    dispatch(updatedChecked(false))

    // add class active 
    const listItems = document.querySelectorAll('.admin-left-listItem');
    listItems.forEach(element => {
      if(element.textContent === item.name){
        element.classList.add('active');
      }else{
        element.classList.remove('active');
      }
    });
  }

  // check title main and show title
  useEffect(()=>{
    listTitles.map(item => {
      if(item.path === location.pathname){
        setTitle(item);
      }
    })
  }, [location.pathname]);

  // get token 
  const token = useSelector(state => state.auth.token)
  
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
    navigate("/")    
  }

  return (
    <div className="admin">
        <div className="admin-left">
            <Link to="/dashboard" className="admin-left-header">
              <img className="admin-left-img" src={logo} alt="" />
            </Link>
            <div className="admin-left-title">
              <ul className="admin-left-lists">
                {
                  listTitles.map((item,index) => (
                    <li 
                      key={index} 
                      className="admin-left-listItem" 
                      onClick={() => handleClick(item)}>
                      {item.icon}
                      {item.name}
                    </li>                
                  ))
                }
              </ul>
            </div>
        </div>
        <div className="admin-right">
          <div className="admin-right-header">
            <div className="admin-right-menu">
                <WidgetsIcon />
                <h1>{title?.name}</h1>
                {
                  subtitle && <>               
                    <DoubleArrowIcon />
                    <h1>{subtitle}</h1>
                  </>
                }
            </div>
            <div className="admin-right-profile">
              <img src={noAvatar} alt="" className="admin-right-logo" />
              <div className="admin-right-info">
                <h3>{token.Username}</h3>
                <span>{token.PhoneNumber}</span>
              </div>
              <div className="admin-right-profile-hover">
                <ul>
                  <li>Cài đặt</li>
                  <li onClick={() => handleLogOut()}>Đăng xuất</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="admin-right-content">
            <Outlet />
          </div>
        </div>

        <ToastContainer />
    </div>
  )
}

export default Admin