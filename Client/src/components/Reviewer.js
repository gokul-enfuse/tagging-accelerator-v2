import React from 'react'
import ReviewerData from './ReviewerData';
import useAuth from '../hooks/useAuth.js';
import SearchBar from './SearchBar';

function Reviewer() {
  const { auth } = useAuth();
  return (
    <div>
      <div>
        <SearchBar/>
      </div>
    
    <div>
      <h1 style={{ marginBottom: '50px', textAlign: 'center', alignItems: 'center', marginTop: 28,color:'white' }}>
        Welcome {auth.profile_name || ""}
      </h1>
      <div style={{ overflowY: 'scroll', height: '400px' }}>
        <ReviewerData />
      </div>
    </div>
    </div>
  );
}

export default Reviewer