import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import axios from "axios";
import useAuth from '../hooks/useAuth.js';
const localhost = '52.44.231.112';

const CompletedTaskData = () => {
    const { auth } = useAuth();
    const [data, setData] = useState([]);
    const [reviewerList, setReviewerList] = useState([]);
    const [assignedTo, setAssignedTo] = useState("");
    const [isSubmitted, setIsSubmitted] = useState({});

    const getCompletedTAsks = () => {
        axios
            .get(`http://${localhost}:5000/completedtasks`)
            .then(response => {
                console.log("Response data:", response.data);
                setData(response.data)
            }).catch(error => console.error(error));
    }
    const getReviewers = () => {
        axios
            .get(`http://${localhost}:5000/allprofiles`)
            .then(response => {
                const allProfiles = response.data
                const reviewerList = allProfiles.length > 0 && allProfiles.filter((item) => item.profile_role === 4)
                console.log("reviewer list is", reviewerList);
                setReviewerList(reviewerList)
            }).catch(error => console.error(error));
    }
    useEffect(() => {
        getCompletedTAsks();
        getReviewers();
    }, [])
    const handleAssignToChange = (taskId, e) => {
        // const newAssignedTo = e.target.value;
        setAssignedTo(e.target.value);
    };
    const handleTaskSubmit = (record) => {
        // const task = data.find(task => task.taskId === record);
        // const payload = { ...task, assignedTo: assignedTo };
        record.reviewer_profile_id = assignedTo;
        record.profile_role = 4 //assigned the role_id of reviewer 
        record.task_role = 4 //assigned the role_id of reviewer 

        axios
            .put(`http://${localhost}:5000/updatetask/` + record.task_id, {
                "id": record.task_id,
                record
            })
            .then(response => {
                let temp = isSubmitted;
                temp[response.data._id] = true
                setIsSubmitted(temp)
                alert("success");
            })
            .catch(error => console.error(error));
    };
    const columns = [
        {
            title: 'Task ID',
            dataIndex: 'task_id',
            key: 'taskId'
        },
        {
            title: 'Task Title',
            dataIndex: 'task_title',
            key: 'taskTitle'
        },
        {
            title: 'Status',
            dataIndex: 'task_status',
            key: 'status'
        },
        {
            title: 'Created Date',
            dataIndex: 'createdDate',
            key: 'creationDate'
        },
        {
            title: 'Assign To',
            dataIndex: 'profile_id',
            key: 'key',

            render: (text, record) => (
                <select name="assignedTo" value={assignedTo[record.profile_id]} onChange={(e) => handleAssignToChange(record.profile_id, e)} disabled={isSubmitted[record.profile_id]} style={{ width: '200px' }}>
                    <option key={""} value={""}>
                        {record.assignedTo || "select"}
                    </option>
                    {reviewerList && reviewerList.map((reviewer) => (
                        <option key={reviewer.profile_id} value={reviewer.profile_id}>
                            {reviewer.profile_username}
                        </option>
                    ))}
                </select>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <button
                    style={isSubmitted[record._id] ? { background: "grey" } : { background: "blue" }}
                    onClick={() => handleTaskSubmit(record)}
                    disabled={isSubmitted[record._id]}
                >
                    Submit
                </button>
            )
        },
    ];

    return (
        <Table columns={columns} dataSource={data} pagination={{ pageSize: 4 }} />
    );
};

export default CompletedTaskData;
