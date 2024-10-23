import { Button, Table } from 'antd';
import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.min.css';
import useAuth from '../hooks/useAuth.js';
import axios from "axios";
import { DOMAIN } from '../Constant.js';
import * as XLSX from 'xlsx'; // Import XLSX library for Excel file generation
import SearchBar from './SearchBar.js';
import { ColorSwitches } from "../utilities/reactToggelButtonCom.js"
import commonfunction from '../utilities/commonFunction.js';

const ProfileData = () => {
    const [data, setData] = useState([]);
    const [xlsxData,setxlsxData] = useState([]);
    const [projectData, setProjectData] = useState([]); 
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
                        project_id: arr[i].project_id,
                        project_name: arr[i].project_name,
                        profile_login_session: arr[i].profile_login_session,
                        profile_login_datetime: (arr[i].profile_login_session > 0)?commonfunction.getHours(arr[i].profile_login_datetime)+' Hours' : 0+' Hours'
                    }
                });
                const tempData = managerProfiles.map((v, i, arr) => {
                   return {
                       FullName: arr[i].profile_fullname,
                       UserName: arr[i].profile_username,
                       Role: arr[i].role_name,
                   }
               });
                setxlsxData(tempData);
                setData(managerProfile);
            }).catch(error => console.error(error));
    }
    // Function to handle download button click
    const handleDownload = () => {
        const worksheet = XLSX.utils.json_to_sheet(xlsxData); // Convert data to worksheet
        const workbook = XLSX.utils.book_new(); // Create a new workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Profiles'); // Add worksheet to the workbook
        XLSX.writeFile(workbook, 'profiles.xlsx'); // Write workbook to an Excel file and download it
    }

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
            dataIndex: 'project_name',
            key: 'projectname'
        },
        {
            title: 'Role',
            dataIndex: 'role_name',
            key: 'role',
        },
        {
            title: 'Login hours',
            dataIndex: 'profile_login_datetime',
            key:'datetime'
        },
        {
            title: 'Action',
            dataIndex: 'logoff',
            key:'logoff',
            render: (text, records) => {
                console.log(records);
                return (<ColorSwitches hours={records.profile_login_datetime} profileId={records.profile_id}/>)
            }
        }
    ];

    useEffect(() => {
        getAllProfiles();
    }, []);

    return (
        <div>
            <div>
                <SearchBar/>
            </div>
        
        <div className='profileDetails'>
        <div style={{ marginBottom: "16px", marginLeft: "auto", width: "fit-content" }}>
                {/* Button to trigger download */}
                <Button type="primary" onClick={handleDownload}>
                    <span>Download</span>
                </Button>
            </div>
            <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />
        </div>
        </div>
    );
}
export default ProfileData;
