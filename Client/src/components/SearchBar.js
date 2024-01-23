import React from 'react'
import SignIn from './SignIn';
import useAuth from '../hooks/useAuth.js';
import { FaBell, FaCheckSquare,FaArrowCircleDown } from 'react-icons/fa';


function SearchBar() {
  const { auth } = useAuth();
  return (
    <div className='searchbar-cont'>
        <div className='search-heading'>
            <h1>ENFUSE TAGGING TOOL</h1>
            <input type='search' placeholder='search' />
        </div>
        <div className='search-icon'>
            <h1><FaBell/></h1>
            <h1><FaCheckSquare/></h1>
            <div className='search-icon-data'>
                <h4>Your Name</h4>
                <p>{auth.profile_username}</p>
            </div>
            <h1><FaArrowCircleDown/></h1>
        </div>
    </div>
  )
}

export default SearchBar;
