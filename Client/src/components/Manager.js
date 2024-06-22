
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DOMAIN } from '../Constant';
import TableData from './TableData';
import useAuth from '../hooks/useAuth.js';
import SearchBar from './SearchBar';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';

const Manager = () => {
    const [projectList, setProjectList] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [managerName, setManagerName] = useState([]);
    const { auth } = useAuth();
  /*const [data, setData] = useState([])
    const [managerProfiles, setManagerProfiles] = useState([]) */

    const showAlert = (mes, icon) => {
        Swal.fire({
          title: '',
          text: mes,
          icon: icon,
          confirmButtonText: 'OK',
        });
    };

    const getProject = () => {
        if (auth.profile_role !== 1) {
            axios
                .get(`${DOMAIN}/projectlist`)
                .then((response) => {
                    const allProject = response.data;
                    axios
                        .get(`${DOMAIN}/allprofiles?profileId=${auth.profileId}`)
                        .then((response) => {
                            const managerProfiles = response.data.filter((item) => item.profile_role === 2 && item.profile_id === auth.profile_id);
                            const managerProjectIds = managerProfiles.flatMap((item) => item.project_id.split(","));
                            const filteredArray = allProject.filter((item1) =>
                                managerProjectIds.includes(item1.project_id.toString())
                            );
                            setProjectList(filteredArray);
                        })
                        .catch((error) => console.error(error));
                })
                .catch((error) => console.error(error));
        } else {
            axios
                .get(`${DOMAIN}/projectlist`)
                .then((response) => {
                    const allProject = response.data;
                    setProjectList(allProject);
                })
                .catch((error) => console.error(error));
        }
    };
    const getManagerName = (projectId) => {
        axios
            .get(`${DOMAIN}/managername/${projectId}`)
            .then((response) => {
                const manager = response.data.manager_names;
                setManagerName(manager.join(', '));
            })
            .catch((error) => {
               // console.error(error);
                showAlert(error.response.data.message, 'error');
                setManagerName("");
            });
    };
    useEffect(() => {
        getProject();
    }, []);

    const handleProjectChange = (event) => {
        const selectedProjectId = event.target.value;
            setSelectedProject(selectedProjectId);
        if (selectedProjectId) {
            getManagerName(selectedProjectId);
        } else {
            setManagerName('');
        }
    };

    return (
        <div style={{height:'95vh'}}>
            <div>
            <SearchBar/>
            </div>
        
        <div>
            <h1 style={{color:'white' ,marginBottom: '50px', textAlign: 'center', alignItems: 'center', marginTop: 80 }}>
                Welcome {auth.profile_username === "admin" ? auth.profile_username : auth.profile_id}
            </h1>
            <div>
                <label style={{ marginTop: 20 ,color:'white'}}>Assigned to Project</label>
                <br />
                <select className='assignedToProject' name='assignedTo' style={{ width: '150px', height: '35px', border: '1px solid skyblue' }} onChange={handleProjectChange}>
                    <option key='0' value=''>Select</option>
                    {projectList &&
                        projectList.map((item) => (
                            <option key={item.project_id} value={item.project_id}>
                                {item.project_name}
                            </option>
                        ))}
                </select>
            </div>
            {auth.profile_role !== 2 && (
                <div>
                    <strong style={{color:'white'}}>Manager Name: {(managerName)? managerName : 'Manager not assigned'}</strong> 
                </div>)}
            {selectedProject && <TableData selectedProject={selectedProject} />}
        </div>
        </div>
    );
};

export default Manager;

