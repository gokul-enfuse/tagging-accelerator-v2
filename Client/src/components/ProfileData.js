import { Button, Table, Select, Input, Modal, Form } from 'antd';
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
    const [data, setData] = useState([])
    // const [rowData, setRowData] = useState([]);
    // const [visible, setVisible] = useState(false);

    // const [form] = Form.useForm();

    // const showModal = (key) => {
    //     setVisible(prevState => ({
    //         ...prevState,
    //         [key]: true
    //     }));
    // };
    // const handleCancel = (key) => {
    //     setVisible(prevState => ({
    //         ...prevState,
    //         [key]: false
    //     }));
    // };

    // const handleOk = () => {
    //     form.validateFields().then(values => {
    //         // Handle form submission here
    //         console.log('Form values:', values);

    //         // Close the modal
    //         handleCancel();
    //     });
    // };

    // // Function to handle the "Edit" button click
    // const handleEdit = key => {
    //     const updatedData = rowData.map(row => {
    //         console.log("row:", row)
    //         if (row.key === key) {
    //             return { ...row, editable: !row.editable };
    //         }
    //         return row;
    //     });

    //     setRowData(updatedData);
    //     showModal();
    // };

    // // Function to handle the "Delete" button click
    // const handleDelete = key => {
    //     const updatedData = rowData.filter(row => row.key !== key);
    //     setRowData(updatedData);
    // };
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
                        console.log("setData:", data)
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
    }

    // Update data with editable flag
    useEffect(() => {
        getAllProfiles();
        // const updatedData = data.map(row => ({
        //     ...row,
        //     editable: false
        // }));
        // setRowData(updatedData);
    }, []);


    let columns = [
        {
            title: "Manager's Full Name",
            dataIndex: 'profile_fullname',
            key: 'key',
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
        },
        // {
        //     title: 'Action',
        //     key: 'action',
        //     render: (text, record) => (
        //         <span>
        //             <Button style={{ width: '30%' }} onClick={() => handleEdit(record.key)}>
        //                 {record.editable ? 'Save' : 'Edit'}
        //             </Button>
        //             <Button style={{ width: '30%' }} onClick={() => handleDelete(record.key)}>Delete</Button>
        //         </span>
        //     ),
        // },
    ]

    return (
        <div>
            <Table columns={columns} dataSource={data} pagination={{ pageSize: 4 }} />
        </div>
    );
}
export default ProfileData;
