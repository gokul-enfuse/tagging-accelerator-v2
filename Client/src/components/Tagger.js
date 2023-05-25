import React from 'react'
import TaggerData from './TaggerData'
import useAuth from '../hooks/useAuth.js';


function Tagger() {
  const { auth } = useAuth();

  return (
    <div>
      <h1>Welcome,{(auth.profile_name===null)?auth.profile_name:'Admin' || ""}</h1>
      <TaggerData />
      </div>
  )
}

export default Tagger
