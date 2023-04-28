import React , { useState, useEffect } from 'react';
import TableData from './TableData';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import axios from "axios";

const Manager = () => {
    const { auth } = useAuth();
    console.log(auth);
    const btnSize = '200px'
    const navigate = useNavigate()
    const [projectList, setProjectList] = useState([])
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
    const getProject = () => {
        if (auth.profile_username === "admin") {
            axios
                .get("http://localhost:5000/projectlist")
                .then(response => {
                    console.log("Response data:", response.data);
                    const allProject = response.data
                    setProjectList(allProject)
                    console.log("tasklist  is:", allProject)
                }).catch(error => console.error(error));
        } else {
            console.log("Project")
        }
    }
    useEffect(() => {
        getProject();
    }, []);
    return (
        <div style={{marginBottom: '150px'}}>
            <h1>Welcome, Manager</h1>
            <div>
                <label>Assigned to Project</label><br />

                <select name="assignedTo" style={{width: '150px', height: '35px', border: '1px solid skyblue'}}>

                    {projectList && projectList.map((item) => (
                        <option key={item.project_id} value={item.project_id}>
                            {item.project_name}
                        </option>
                    ))}</select>

                {/* <Button variant="outlined" style={{ width: btnSize, margin: '8px' }} onClick={handleCreateProfile}>Create Profile</Button>
                <Button variant="outlined" style={{ width: btnSize, margin: '8px' }} onClick={handleProfileDetails}>Profile Details</Button> */}


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