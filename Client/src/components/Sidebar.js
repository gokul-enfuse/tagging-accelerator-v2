import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import logo from './enfuse-logo.png';
import { FaTh, FaAdn, FaBars } from "react-icons/fa";
import { MdDns, MdPreview } from 'react-icons/md';
import { GrUserManager } from 'react-icons/gr';
import useAuth from "../hooks/useAuth";
import Button from '@mui/material/Button';
import { ROLES } from './ROLES';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

const MenuItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSubMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <li>
      <NavLink to={item.path} className="link" onClick={toggleSubMenu}>
        <span className='icon'>{item.icon}</span>
        <span >{item.name}</span>
        {item.submenu && (
          <span className='link-text'>
            {isOpen ? <FaChevronDown /> : <FaChevronRight />}
          </span>
        )}
      </NavLink>
      {item.submenu && isOpen && (
        <ul>
          {item.submenu.map((subitem) => (
            <MenuItem key={subitem.id} item={subitem} />
          ))}
        </ul>
      )}
    </li>
  );
};

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);

  const menuItem = [
    {
      path: "/admin",
      id: 1,
      name: "Admin",
      icon: <FaAdn />,
      submenu: [
        {
          id: 4,
          name: 'Create Project',
          path: '/createproject',
        },
        {
          id: 5,
          name: 'Create Profile(Manager)',
          path: '/createprofile',
        },

      ],
    },

    {
      path: "/manager",
      id: 2,
      name: "Manager",
      id: 2,
      icon: <GrUserManager />,
      submenu: [
        {
          id: 4,
          name: 'Create Profile(Tagger & Reviewer)',
          path: '/createprofilemanager',
        },
        {
          id: 5,
          name: 'Profile Details',
          path: '/profiledetailsmanager',
        },
        {
          id: 6,
          name: 'Create Task',
          path: '/createtask',
        },
        {
          id: 7,
          name: 'Assign To Reviewer',
          path: '/assigntoreviewer',
        },
  
      ]
    },
    {
      path: "/tagger",
      id: 3,
      name: "Tagger",
      id: 3,
      icon: <MdDns />

    },
    {
      path: "/reviewer",
      id: 4,
      name: "Reviewer",
      id: 4,
      icon: <MdPreview />
    },
    {
      path: "/reports",
      id: 5,
      name: "Reports",
      id: 5,
      icon: <FaTh />
    },
    {
      path: "/annotation",
      id: 6,
      name: "Annotation Tool",
      id: 6,
      icon: <FaTh />
    },
{
      path: "/historicalrecords",
      id: 7,
      name: "Historical Records",
      id: 7,
      icon: <FaTh />
    },
  ]

  const { auth, setAuth } = useAuth();
  const logout = () => {
    setAuth({})
    console.log("Logged out")
  }

console.log(auth);
  return (
    <div className='container'>
      {auth.profile_role && <div style={{ width: isOpen ? "300px" : "50px" }} className='sidebar'>
        <div className='top-section'>
          <img style={{ display: isOpen ? "block" : "none" }} src={logo} alt='logo' />
          <div style={{ width: isOpen ? "300px" : "50px" }} className='bars'><FaBars onClick={toggle} /></div>
        </div>
        <nav>
          <ul>
            {
              menuItem.map((item, index) => (
                (auth.profile_role === ROLES.ADMIN || auth.profile_role === item.id) &&
                <MenuItem key={item.id} item={item} />
              ))
            }
          </ul>
        </nav>
        {auth.profile_role &&
          <Button variant="outlined" style={{ width: '150px', margin: '55px', fontSize: '20px', color: "white", borderWidth: "1px", borderColor: "lightblue " }} onClick={logout} to="/" ><b> Logout </b></Button>}

      </div>}
      <main>{children}</main>
    </div>
  );
};

export default Sidebar;