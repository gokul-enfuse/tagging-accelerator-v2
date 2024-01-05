import React from 'react';
import ProfileData from './ProfileData.js';
//import Button from '@mui/material/Button';
//import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar.js';


function Reports() {

    return (
      <div>
        <div>
            <SearchBar/>
        </div>
      
      <div>
      <h1 style={{ marginBottom: '50px', textAlign: 'center', alignItems: 'center', marginTop: 122 }}>
         
      </h1>
      <div style={{ overflowY: 'scroll', height: '400px' }}>
      <ProfileData />
      </div>
    </div>
    </div>
      
    )
}

export default Reports
