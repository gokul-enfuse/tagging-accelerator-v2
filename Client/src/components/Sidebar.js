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
import customAdminIcon from '../Icons/admin_logo.png';
import customManagerIcon from '../Icons/manager_logo.png';
import customTaggerIcon from '../Icons/tagger_logo.png';
import customReviewerIcon from '../Icons/reviewer_logo.png';
import customAnnotationToolIcon from '../Icons/annotation_tool_logo.png';
import customReportsIcon from '../Icons/reports_logo.png';
import customHistoricalRecordsIcon from '../Icons/historical_records_logo.png';

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

  const { auth, setAuth } = useAuth();
  const menuItem = [
    {
      path: "/admin",
      id: 1,
      name: "Admin",
      // icon: <FaAdn />,
      icon: <img src={customAdminIcon} width={'35px'} alt="Admin Icon" />,
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
      // icon: <GrUserManager />,
      icon: <img src={customManagerIcon} width={'35px'} alt="Admin Icon" />,
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
    // {
    //   path: "/tagger",
    //   id: 3,
    //   name: "Tagger",
    //   // icon: <MdDns />
    //   icon: <img src={customTaggerIcon} width={'35px'} alt="Tagger Icon" />,

    // },




  ]

  const reports = {
    path: "/reports",
    id: 5,
    name: "Reports",
    // icon: <FaTh />
    icon: <img src={customReportsIcon} width={'35px'} alt="Reports Icon" />,
  }

  const annotation = {
    path: "/annotation",
    id: 7,
    name: "Annotation Tool",
    // icon: <FaTh />
    icon: <img src={customAnnotationToolIcon} width={'35px'} alt="Annotation Icon" />,
  }

  const bulkupload = {
    path: "/bulkupload",
    id: 6,
    name: "Bulk Upload",
    // icon: <FaTh />
    icon: <img src={customAnnotationToolIcon} width={'35px'} alt="Admin Icon" />,
  }

  const reviewer = {

    path: "/reviewer",
    id: 4,
    name: "Reviewer",
    // icon: <MdPreview />
    icon: <img src={customReviewerIcon} width={'35px'} alt="Reviewer Icon" />,

  }

  const historicalMenu = {
    path: "/historicalrecords",
    id: 8,
    name: "Historical Records",
    // icon: <FaTh />
    icon: <img src={customHistoricalRecordsIcon} width={'35px'} alt="Historical Records Icon" />,
  }
  const tagger = {
    path: "/tagger",
    id: 3,
    name: "Tagger",
    // icon: <MdDns />
    icon: <img src={customTaggerIcon} width={'35px'} alt="Tagger Icon" />,

  }
  const logout = () => {
    setAuth({})
  }
  const sidebarStyle = {
    height:
      auth.profile_role === ROLES.ADMIN ? "100vh" :
        auth.profile_role === ROLES.MANAGER ? "100vh" :
          auth.profile_role === ROLES.TAGGER ? "100vh" :
            auth.profile_role === ROLES.REVIEWER ? "100vh" :
              "auto",
  };
  return (
    <div className='container'>
      {auth.profile_role && <div style={{ width: isOpen ? "300px" : "50px", ...sidebarStyle }} className='sidebar'>

        <div className='top-section'>
          <img style={{ display: isOpen ? "block" : "none" }} src={logo} alt='logo' />
          <div style={{ width: isOpen ? "300px" : "50px" }} className='bars' ><FaBars onClick={toggle} /></div>
        </div>
        <nav>
          <ul>
            {
              menuItem.map((item, index) => (
                (auth.profile_role === ROLES.ADMIN || auth.profile_role === item.id) &&

                <MenuItem key={item.id} item={item} profileRole={auth.profile_role} />
              ))
            }
            {(auth.profile_role === ROLES.ADMIN || auth.profile_role === ROLES.MANAGER) &&
              <MenuItem key={historicalMenu.id} item={historicalMenu} profileRole={auth.profile_role} />}

            {(auth.profile_role === ROLES.ADMIN || auth.profile_role === ROLES.MANAGER) &&
              <MenuItem key={tagger.id} item={tagger} profileRole={auth.profile_role} />}

            {(auth.profile_role === ROLES.ADMIN || auth.profile_role === ROLES.MANAGER) &&
              <MenuItem key={reviewer.id} item={reviewer} profileRole={auth.profile_role} />}

            {(auth.profile_role === ROLES.ADMIN || auth.profile_role === ROLES.MANAGER) &&
              <MenuItem key={reports.id} item={reports} profileRole={auth.profile_role} />}

            {(auth.profile_role === ROLES.ADMIN || auth.profile_role === ROLES.MANAGER) &&
              <MenuItem key={bulkupload.id} item={bulkupload} profileRole={auth.profile_role} />}

            {(auth.profile_role === ROLES.ADMIN || auth.profile_role === ROLES.MANAGER) &&
              <MenuItem key={annotation.id} item={annotation} profileRole={auth.profile_role} />}

          </ul>
        </nav>
        {auth.profile_role &&
          <Button variant="outlined" style={{ width: '150px', margin: '20px 10px 24px 36px', fontSize: '20px', color: "black", borderWidth: "1px", borderColor: "lightblue " }} onClick={logout} to="/" ><b> Logout </b></Button>}

      </div>}
      <main>{children}</main>
    </div>
  );
};

export default Sidebar;