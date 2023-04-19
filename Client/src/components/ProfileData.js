import { Button, Table, Select } from 'antd';
import React, { useState } from 'react';
import 'antd/dist/antd.min.css'
import useAuth from '../hooks/useAuth.js';
import axios from "axios";
import { useEffect } from 'react';

let columns = [
    {
        title: "Manager's Full Name",
        dataIndex: 'fullName',
        key: 'key'
    },
    {
        title: 'Username',
        dataIndex: 'username',
        key: 'key'
    },
    {
        title: 'Assigned Projects',
        dataIndex: 'projectNames',
        key: 'key',
    }
]

const ProfileData = () => {
    let [data, setData] = useState([])
    const getAllProfiles = () => {
        axios
            .get("http://localhost:5000/allprofiles")
            .then(response => {
                console.log("Response data:", response.data);
                const managerProfiles = response.data.filter(item => item.role === "Manager")
                console.log("managerProfiles:", managerProfiles)
                setData(managerProfiles)
            })
            .catch(error => console.error(error));
    }
    useEffect(() => {
        getAllProfiles();
    }, []);

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
