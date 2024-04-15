import { Button, Table, Select } from 'antd';
import React, { useState } from 'react';
import 'antd/dist/antd.min.css'
import useAuth from '../hooks/useAuth.js';
import axios from "axios";
import { useEffect } from 'react';
import { DOMAIN } from '../Constant.js';
import SearchBar from './SearchBar.js';


const ProfileData = () => {
    let [data, setData] = useState([]);
    
    /* const getAllProject = (arg) => {
        axios
            .get(`${DOMAIN}/allprojects`)
            .then(res => {
                console.log(res.data);
                setProjectData(res.data);
            }).catch(error => {
                console.log(error);
            });
    } */
    const getAllProfiles = () => {
        axios
            .get(`${DOMAIN}/taggerandreviewerprofiles`)
            .then(response => {
                const managerProfiles = (response.data.length > 0)? response.data : [];                
                const managerProfile = managerProfiles.map((v, i, arr) => {
                    //project_Name: projectData.filter(item => arr[i].project_id.split(',').every(value => item.project_id == value))
                    return {
                        createdDate: arr[i].createdDate,
                        modifiedDate: arr[i].modifiedDate,
                        profile_email: arr[i].profile_email,
                        profile_fullname: arr[i].profile_fullname,
                        profile_id: arr[i].profile_id,
                        profile_name: arr[i].profile_name,
                        profile_role: arr[i].profile_role,
                        profile_username: arr[i].profile_username,
                        role_name: arr[i].role_name,
                        project_id: arr[i].project_id
                    }
                });
                setData(managerProfile);
            }).catch(error => console.error(error));
    }
    //console.log(data)
    const columns = [
        {
            title: "Full Name",
            dataIndex: 'profile_fullname',
            key: 'fullname'
        },
        {
            title: 'Username',
            dataIndex: 'profile_username',
            key: 'username'
        },
        {
            title: 'Assigned Projects',
            dataIndex: 'project_Name',
            key: 'projectname',
            render: (text, records) => (
                <Specificproject record={records}/>
            )
        },
        {
            title: 'Role',
            dataIndex: 'role_name',
            key: 'role',
        }
    ];
    
    const Specificproject = ({ record }) => {  
        let [projectData, setProjectData] = useState([]);      
        useEffect(() => {
            axios.get(`${DOMAIN}/profilerelateproject`, {
                params: {
                    project_ids: record.project_id
                }
            })
            .then(res => {
                setProjectData(res.data[0]);
            }).catch(error => {
                console.log(error);
            });
        }, []);
        return (<div key={projectData.project_id}>{projectData.project_name}</div>)
    }

    useEffect(() => {
        getAllProfiles();
    }, []);

    return (
        <div>
            <div>
                <SearchBar/>
            </div>
        
        <div className='profileDetails'>
            <div style={{ marginBottom: 16 }}>
                <span style={{ marginRight: 8 }}><a>Download</a></span>
            </div>
            <Table columns={columns} dataSource={data} pagination={{ pageSize: 8 }} />
        </div>
        </div>
    );
}
export default ProfileData;
