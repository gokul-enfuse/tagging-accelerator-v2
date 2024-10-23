import React,{useState} from 'react'
import ReviewerData from './ReviewerData';
import useAuth from '../hooks/useAuth.js';
import SearchBar from './SearchBar';

function Reviewer() {
  const { auth } = useAuth();
  const [searchValue,setSearchValue] = useState('');
  return (
    <div>
      <div>
        <SearchBar setSearchValue={setSearchValue}/>
      </div>
    
    <div>
      <h1 style={{ marginBottom: '50px', textAlign: 'center', alignItems: 'center', marginTop: 28,color:'white' }}>
        Welcome {(auth.profile_name !== 'null') ? auth.profile_name : auth.profile_username} - Reviewer Page
      </h1>
      <div style={{ overflowY: 'auto', height: '400px' }}>
        <ReviewerData  searchValue={searchValue} />
      </div>
    </div>
    </div>
  );
}

export default Reviewer