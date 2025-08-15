import React from 'react';
import { useDispatch } from 'react-redux';
import './style.scss';

import ListIcon from '../../assets/icon/list.svg';
import { toggleSidebar } from '../../redux/sidebar/sidebarSlice';

function Navbar() {
  const dispatch = useDispatch();

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <nav>
      <img 
        src={ListIcon} 
        className="icon" 
        onClick={handleToggleSidebar}
        alt="Toggle Sidebar"
      />
      <h2>Hatme Yolu</h2>
    </nav>
  );
}

export default Navbar;
