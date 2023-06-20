import React from 'react';
import "./Sidebar.scss";
import { Outlet } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
        <div className="sidebar-left">
            Sidebar
        </div>
        <div className="sidebar-right">
            <Outlet />
        </div>
    </div>
  )
}

export default Sidebar