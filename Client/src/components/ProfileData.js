import { Button, Table, Select } from 'antd';
import React, { useState } from 'react';
import 'antd/dist/antd.min.css'
//import useAuth from '../hooks/useAuth.js';
import axios from "axios";
import { useEffect } from 'react';

// let columns = [
//     {
//         title: "Manager's Full Name",
//         dataIndex: 'profile_fullname',
//         key: 'key'
//     },
//     {
//         title: 'Username',
//         dataIndex: 'profile_username',
//         key: 'key'
//     },
//     {
//         title: 'Assigned Projects',
//         dataIndex: 'project_name',
//         key: 'key',
//     }
// ]

const ProfileData = () => {
    let [data, setData] = useState([])
    const getAllProfiles = () => {
        axios
            .get("http://localhost:5000/allprofiles")
            .then(response => {
                console.log("Response data:", response.data);
                {/*const managerProfiles = response.data.filter(item => item.profile_role === 2)*/ }

                const managerProfiles = response.data.length > 0 && response.data.filter(item => item.profile_role === 2)
                console.log("managerProfiles:", managerProfiles)
                setData(managerProfiles)

                axios
                    .get("http://localhost:5000/allprojects")
                    .then(response => {
                        console.log("Response data projects:", response.data);
                        const allprojects = response.data
                        const result = managerProfiles.map(eachProfile => {
                            const filteredArray = allprojects.filter(item1 => {
                                console.log("item1", item1);
                                return eachProfile.project_id.split(",").some(item2 => {
                                    console.log("item2:", item2);
                                    return item1.project_id.toString() === item2
                                })
                            }).map(item => item.project_Name);
                            eachProfile.project_name = filteredArray.toString()
                            return eachProfile
                        })
                        console.log("result is:", result)
                        setData(result)
                    })
                    .catch(error => console.error(error));
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
