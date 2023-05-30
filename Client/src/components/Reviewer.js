import React from 'react'
import ReviewerData from './ReviewerData';
import useAuth from '../hooks/useAuth.js';

function Reviewer() {
  const { auth } = useAuth();
  return (
    <div>
      <h1>Welcome, {auth.profile_name || ""} </h1>
      <ReviewerData />
    </div>
  )
}
export default Reviewer