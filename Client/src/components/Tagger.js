import React from 'react'
import TaggerData from './TaggerData'
import useAuth from '../hooks/useAuth.js';


function Tagger() {
  const { auth } = useAuth();

  return (
    <div>
      <h1 style={{ marginBottom: '50px', textAlign: 'center', alignItems: 'center', marginTop: 80 }}>Welcome {auth.profile_name || ""}</h1>
      <div style={{ overflowY: 'scroll', height: '400px', overflowX: 'hidden' }}>
        <TaggerData />
      </div>
    </div>
  )
}

export default Tagger
