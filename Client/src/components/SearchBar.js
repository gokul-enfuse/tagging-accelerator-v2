import React from 'react'
import SignIn from './SignIn';
import useAuth from '../hooks/useAuth.js';
import { FaBell, FaCheckSquare,FaArrowCircleDown } from 'react-icons/fa';


function SearchBar() {
  const { auth } = useAuth();
  return (
    <div className='searchbar-cont'>
        <div className='search-heading'>
            <h3>ENFUSE TAGGING TOOL</h3>
            <input type='search' placeholder='search' />
        </div>
        <div className='search-icon'>
            <h3><FaBell/></h3>
            <h3><FaCheckSquare/></h3>
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
