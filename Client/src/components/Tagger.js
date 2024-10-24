import React, { useState } from 'react'
import TaggerData from './TaggerData'
import useAuth from '../hooks/useAuth.js';
import SearchBar from './SearchBar';
//import Sidebar from './Sidebar';

function Tagger() {
  const { auth } = useAuth();
  const [searchValue,setSearchValue] = useState('');
  return (
    <div>
      <div>
        <SearchBar setSearchValue={setSearchValue}/>
      </div>
    
    <div>
      <h1 style={{ marginBottom: '5px', textAlign: 'center', alignItems: 'center', marginTop: 5 ,color:'white',fontSize:'18px'}}>Welcome {(auth.profile_name !== 'null') ? auth.profile_name : auth.profile_username} - Tagger Page</h1>
      <div >
        <TaggerData searchValue={searchValue}/>
      </div>
    </div>
    </div>
  )
}

export default Tagger
