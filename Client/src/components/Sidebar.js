import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import logo from './enfuse-logo.png';
import { FaTh, FaAdn, FaBars } from "react-icons/fa";
import { MdDns, MdPreview } from 'react-icons/md';
import { GrUserManager } from 'react-icons/gr';
import useAuth from "../hooks/useAuth";
import Button from '@mui/material/Button';
import { ROLES } from './ROLES';


const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);

  const menuItem = [
    {
      path: "/admin",
      name: "Admin",
      id: 1,
      icon: <FaAdn />
    },

    {
      path: "/manager",
      name: "Manager",
      id: 2,
      icon: <GrUserManager />

    },
    {
      path: "/tagger",
      name: "Tagger",
      id: 3,
      icon: <MdDns />

    },
    {
      path: "/reviewer",
      name: "Reviewer",
      id: 4,
      icon: <MdPreview />
    },
    {
      path: "/reports",
      name: "Reports",
      id: 5,
      icon: <FaTh />
    },
    // {
    //   path: "/logout",
    //   name: "Logout",
    //   icon: <MdLogout />
    // }
  ]

const { auth, setAuth } = useAuth();
const logout =() =>{
  setAuth({})
  console.log("Logged out")
}


  return (
    <div className='container'>
      {auth.profile_role && <div style={{ width: isOpen ? "300px" : "50px" }} className='sidebar'>
        <div className='top-section'>
          <img style={{ display: isOpen ? "block" : "none" }} src={logo} alt='logo' />
          <div style={{ width: isOpen ? "300px" : "50px" }} className='bars'><FaBars onClick={toggle} /></div>
        </div>
        {
          menuItem.map((item, index) => (
            (auth.profile_role === ROLES.ADMIN || auth.profile_role === item.id) &&
            <NavLink to={item.path} key={index} className="link">
              <div className='icon'>{item.icon}</div>
              <div className='link-text'>{item.name}</div>
            </NavLink>
          ))
        }
        {auth.profile_role &&
        <Button variant="outlined"   style={{ width: '150px', margin: '55px', fontSize: '20px', color: "white", borderWidth: "1px", borderColor: "lightblue " }}  onClick={logout} to="/" ><b> Logout </b></Button>}

      </div>}
      <main>{children}</main>
    </div>
  );
};

export default Sidebar;