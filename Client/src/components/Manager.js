import React from 'react';
import TableData from './TableData';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';


const Manager = () => {
    const { auth } = useAuth();
    const btnSize = '200px'
    const navigate = useNavigate()
    const handleClick = () => {
        navigate({
            pathname: '/createtask',
            state: { previousRoute: '/manager' }
        });
    }

    const handleCreateProfile = () => {
        navigate('/createprofilemanager')
      }
      const handleProfileDetails = () => {
        navigate('/profiledetailsmanager')
      }
    return (
        <div style={{marginBottom: '150px'}}>
            <h1>Welcome, Manager</h1>
            <div>
                <label>Assigned To</label><br />

                <select name="assignedTo" style={{width: '150px', height: '35px', border: '1px solid skyblue'}}>

                    {auth.project_names && auth.project_names.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}</select>

                <Button variant="outlined" style={{ width: btnSize, margin: '8px' }} onClick={handleCreateProfile}>Create Profile</Button>
                <Button variant="outlined" style={{ width: btnSize, margin: '8px' }} onClick={handleProfileDetails}>Profile Details</Button>


                {/*<Button variant="contained" component="label" style={{ width: btnSize, margin: '8px' }}>Upload Image
                    <input hidden accept="image/*" multiple type="file" />
                </Button>
                <Button variant="contained" component="label" style={{ width: btnSize, margin: '8px' }}>Upload Document
                    <input hidden accept="image/*" multiple type="file" />
                </Button>

                <Button variant="contained" component="label" style={{ width: btnSize, margin: '8px' }}>Upload PDF
                    <input hidden accept="image/*" multiple type="file" />
                </Button>*/}

            </div>
            <TableData />
        </div>
    )
}
export default Manager;