import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import axios from "axios";
import useAuth from '../hooks/useAuth.js';

const CompletedTaskData = () => {
    const { auth } = useAuth();
    const [data, setData] = useState([]);
    const [reviewerList, setReviewerList] = useState([]);
    const [assignedTo, setAssignedTo] = useState("");
    const [isSubmitted, setIsSubmitted] = useState({});

    const getCompletedTAsks = () => {
        axios
            .get("http://localhost:5000/completedtasks")
            .then(response => {
                console.log("Response data:", response.data);
                setData(response.data)
            }).catch(error => console.error(error));
    }
    const getTaggers = () => {
        axios
            .get("http://localhost:5000/allprofiles")
            .then(response => {
                const allProfiles = response.data
                const reviewerList = allProfiles.filter((item) => item.profile_role === 4)
                console.log("reviewer list is", reviewerList);
                setReviewerList(reviewerList)
            }).catch(error => console.error(error));
    }
    useEffect(() => {
        getCompletedTAsks();
        getTaggers();
    }, [])
    const handleAssignToChange = (taskId, e) => {
        const newAssignedTo = e.target.value;
        console.log("new assignee is :", e.target.value)
        setAssignedTo(newAssignedTo);
    };
    const handleTaskSubmit = (record) => {
        // const task = data.find(task => task.taskId === record);
        // const payload = { ...task, assignedTo: assignedTo };
        console.log("task id is :", record, ",assigned to is:", record.assignedTo)
        axios
            .put("http://localhost:5000/updatetask", {
                "id": record.task_id,
                "updatedData": { "assignedTo": assignedTo }
            })
            .then(response => {
                console.log("response handlechange data is:", response);

                let temp = isSubmitted;
                temp[response.data._id] = true
                setIsSubmitted(temp)
                console.log("temp value is :", temp, response.data._id)
                console.log("is submitted is:", isSubmitted)
                alert("success");
            })
            .catch(error => console.error(error));
    };
    const columns = [
        {
            title: 'Task Title',
            dataIndex: 'taskTitle',
            key: 'taskTitle'
        },
        {
            title: 'Task ID',
            dataIndex: 'taskId',
            key: 'taskId'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: 'Created Date',
            dataIndex: 'creationDate',
            key: 'creationDate'
        },
        {
            title: 'Assign To',
            dataIndex: 'assignedTo',
            key: 'key',

            render: (text, record) => (
                <select name="assignedTo" value={assignedTo[record.profile_id]} onChange={(e) => handleAssignToChange(record.profile_id, e)} disabled={isSubmitted[record.profile_id]}>
                    <option key={""} value={""}>
                         {record.assignedTo || "select"}
                    </option>
                    {reviewerList && reviewerList.map((reviewer) => (
                        <option key={reviewer.id} value={reviewer.username}>
                            {reviewer.username}
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
                    Submit {Boolean(isSubmitted[record._id]) + "test"}
                </button>
            )
        },
    ];

    return (
        <Table columns={columns} dataSource={data} pagination={{ pageSize: 4 }} />
    );
};

export default CompletedTaskData;
