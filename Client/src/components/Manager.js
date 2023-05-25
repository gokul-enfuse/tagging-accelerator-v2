import React, { useState, useEffect } from 'react';
import TableData from './TableData';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import axios from "axios";
const localhost = '52.44.231.112';

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
        axios
            .get(`http://${localhost}:5000/projectlist`)
            .then(response => {
                console.log("Response data:", response.data);
                const allProject = response.data
                if (auth.profile_username !== "admin") {
                    const projectIds = auth.project_id.split(",");
                    console.log(projectIds)
                    console.log("projectList:", allProject)
                    const filteredArray = allProject.filter(item1 => {
                        console.log("item1", item1);
                        return projectIds.some(item2 => {
                            console.log("item2:", item2);
                            return item1.project_id.toString() === item2
                        })
                    })
                    setProjectList(filteredArray)
                    console.log("filteredArray:", filteredArray)
                    // document.getElementById("demo").innerHTML = myArray;
                    // setProjectList(auth.project_id)
                    console.log("Project")
                }
                else { setProjectList(allProject) }
                console.log("projectlist  is:", allProject)
            }).catch(error => console.error(error));
    }
    useEffect(() => {
        getProject();
    }, []);
    return (
        <div>
            <h1 style={{ marginBottom: '50px', textAlign: 'center', alignItems: 'center', marginTop: 80 }}>Welcome, {(auth.profile_name===null)?auth.profile_name:'Admin' || ""}</h1>
            <div>
                <label style={{ marginTop: 20 }}>Assigned to Project</label><br />
                <select name="assignedTo" style={{ width: '150px', height: '35px', border: '1px solid skyblue' }}>
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