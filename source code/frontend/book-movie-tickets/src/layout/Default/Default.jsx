import React from 'react';
import "./Default.scss";
import { Outlet, useNavigate } from 'react-router-dom'
import Header from '../../components/default/header/Header'
import Footer from '../../components/default/footer/Footer'
import { useSelector } from 'react-redux';
import Login from '../../components/login/Login';
import Register from '../../components/register/Register';
import { useEffect } from 'react';

const Default = () => {
  const isFormLogin = useSelector(state => state.auth.isAuth);
  return (
    <div className='default'>
      <div className="default-header">
        <Header />
      </div>
      <div className="default-container">
        <Outlet />  
      </div>
      <div className="default-footer">
        <Footer />
      </div>
      {
        isFormLogin === 1 && (
          <Login />
        )
      }
       {
        isFormLogin === 2 && (
          <Register />
        )
      }
    </div>
  )
}

export default Default