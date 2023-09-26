
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DOMAIN } from '../Constant';
import TableData from './TableData';
import useAuth from '../hooks/useAuth.js';

const Manager = () => {
    const [projectList, setProjectList] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [managerName, setManagerName] = useState([]);
    const { auth } = useAuth();
    const [data, setData] = useState([])

    const [managerProfiles, setManagerProfiles] = useState([])

    const getProject = () => {
        if (auth.profile_role !== 1) {
            axios
                .get(`${DOMAIN}/projectlist`)
                .then((response) => {
                    const allProject = response.data;
                    console.log("All Projects:", allProject);
                    axios
                        .get(`${DOMAIN}/allprofiles?profileId=${auth.profileId}`)
                        .then((response) => {
                            console.log("All Profiles:", response.data);
                            const managerProfiles = response.data.filter((item) => item.profile_role === 2 && item.profile_id === auth.profile_id);
                            console.log("Manager Profiles:", managerProfiles);
                            const managerProjectIds = managerProfiles.flatMap((item) => item.project_id.split(","));
                            console.log("Manager Project IDs:", managerProjectIds);
                            const filteredArray = allProject.filter((item1) =>
                                managerProjectIds.includes(item1.project_id.toString())
                            );

                            console.log("Filtered Projects:", filteredArray);
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
                    console.log("All Projects:", allProject);
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
                console.log("manager:", manager);
                setManagerName(manager.join(', '));
            })
            .catch((error) => {
                console.error(error);
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
        <div>
            <h1 style={{ marginBottom: '50px', textAlign: 'center', alignItems: 'center', marginTop: 80 }}>
                Welcome {auth.profile_fullname}
            </h1>
            <div>
                <label style={{ marginTop: 20 }}>Assigned to Project</label>
                <br />
                <select
                    name='assignedTo'
                    style={{ width: '150px', height: '35px', border: '1px solid skyblue' }}
                    onChange={handleProjectChange}
                >
                    <option key='0' value=''>
                        Select
                    </option>
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
                    <strong>Manager Name:</strong> {managerName}
                </div>)}
            {selectedProject && <TableData selectedProject={selectedProject} />}
        </div>
    );
};

export default Manager;

