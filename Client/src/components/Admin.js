import React from 'react';
import TableData from './TableData';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function Admin() {
  const btnSize = '200px'
  const navigate = useNavigate();
  const handleClick = () => {

    navigate('/createtask', { state: { previousRoute: '/admin' } });
  }

  const handleCreateProfile = () => {
    navigate('/createprofile')
  }

  const handleReviewer = () => {
    navigate('/assigntoreviewer')

  }

  const handleCreateProject = () => {
    navigate('/createproject', { state: { previousRoute: '/admin' } })

  }
  return (
    <div style={{ marginBottom: '400px', textAlign: 'center', alignItems: 'center' }}>
      <h1 style={{ marginTop: 100 }}>Welcome Admin</h1> <br />
      {/* <Button variant="outlined" style={{ width: btnSize, margin: '8px' }} onClick={handleCreateProject}>Create Project</Button>
        <Button variant="outlined" style={{ width: btnSize, margin: '8px' }} onClick={handleCreateProfile}>Create Profile</Button>        
        <Button variant="outlined" style={{ width: btnSize, margin: '8px' }} onClick={handleClick} >Create task</Button>
        <Button variant="outlined" style={{ width: btnSize, margin: '8px' }} onClick={handleReviewer} >Assign to Reviewer</Button> */}
      {/* <TableData /> */}
    </div>
  )
}

export default Admin
