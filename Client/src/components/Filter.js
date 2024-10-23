import React, { useState } from 'react'
import FilterData from './FilterData'
import useAuth from '../hooks/useAuth.js';
import SearchBar from './SearchBar';
//import Sidebar from './Sidebar';

function Filter() {
  const { auth } = useAuth();
  const [searchValue,setSearchValue] = useState('');
  return (
    <div>
      <div>
        <SearchBar setSearchValue={setSearchValue}/>
      </div>
    
    <div>
      <h1 style={{ marginBottom: '5px', textAlign: 'center', alignItems: 'center', marginTop: 5 ,color:'white',fontSize:'22px'}}>Filter</h1>
      <div >
        <FilterData searchValue={searchValue}/>
      </div>
    </div>
    </div>
  )
}

export default Filter
