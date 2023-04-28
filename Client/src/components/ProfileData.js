import { Button, Table, Select } from 'antd';
import React, { useState } from 'react';
import 'antd/dist/antd.min.css'
//import useAuth from '../hooks/useAuth.js';
import axios from "axios";
import { useEffect } from 'react';


const ProfileData = () => {
    let [data, setData] = useState([])
    const getAllProfiles = () => {
        axios
            .get("http://localhost:5000/allprofiles")
            .then(response => {
                console.log("Response data:", response.data);
                const managerProfiles = response.data.length > 0 && response.data.filter(item => item.profile_role === 2)
                console.log("managerProfiles:", managerProfiles)
                setData(managerProfiles)
            })
            .catch(error => console.error(error));
    }
    useEffect(() => {
        getAllProfiles();
    }, []);
    let columns = [
        {
            title: "Manager's Full Name",
            dataIndex: 'profile_fullname',
            key: 'key'
        },
        {
            title: 'Username',
            dataIndex: 'profile_username',
            key: 'key'
        },
        {
            title: 'Assigned Projects',
            dataIndex: 'project_name',
            key: 'key',
        }
    ]
    
    return (
        <div>
            <div
                style={{
                    marginBottom: 16,
                }}
            >
                <span
                    style={{
                        marginRight: 8,
                    }}
                >
                </span>
            </div>
            <Table columns={columns} dataSource={data} pagination={{ pageSize: 4 }} />
        </div>
    );
}





export default ProfileData;
