 

import { Button, Table, Select } from 'antd';
import React, { useState } from 'react';
import 'antd/dist/antd.min.css';
import { ROLES } from './ROLES.js';
import useAuth from '../hooks/useAuth.js';
import axios from "axios";
import { useEffect } from 'react';
import { DOMAIN } from '../Constant.js';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';

const { Option } = Select;


const ReviewerData = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();
  const reviewerId = (auth.profile_username === "admin") ? auth.profile_username : auth.profile_id;

  let [data, setData] = useState([])
  const [selectedStatus, setSelectedStatus] = useState("");


  const handleStatusChange = (record, value, text) => {
    console.log("value is:", value);
    setSelectedStatus(value);
    record.task_status = value;
    // record.reviewer_profile_id = 0
    record.task_role = 3
    record.reviewer_task_status = value;
    console.log("record 111:", record)
    if (value === "Fail") {
      record.task_status = "Reassigned"
      axios
        .put(`${DOMAIN}/updatetask/${record.task_id}`, {
          record
          // task_title: record.task_title,
          // task_status: value,
          // profile_id: record.profile_id,
          // task_role: record.task_role
        }).then(response => {
          console.log("response handlechange data is:", response);
          showAlert(response.data.message);
        }).catch(error => console.error(error));
    }
    else {
      record.reviewer_task_status = "Pass"
      axios
        .put(`${DOMAIN}/updatetask/${record.task_id}`, {
          record
          // task_title: record.task_title,
          // task_status: value,
          // profile_id: record.profile_id,
          // task_role: record.task_role
        }).then(response => {
          console.log("response handlechange data is:", response);
          showAlert(response.data.message);
        }).catch(error => console.error(error));
    }

  }

  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
 
  const getReviewers = () => {

    axios
      .get(`${DOMAIN}/allprofiles`)
      .then(response => {
        const allProfiles = response.data
        console.log("response data is for reviewer", response.data);
        const reviewerlist = allProfiles.length > 0 && allProfiles.filter((item) => item.profile_role === 4);
        console.log("reviewer list is", reviewerlist);
        // setReviewers(reviewerlist)
        getTask(reviewerId, reviewerlist)
      })
      .catch(error => console.error(error));
  }

  const getTask = (reviewerIdInfo, reviewers) => {
    console.log("reviewerId", reviewerId, reviewerIdInfo, reviewers)
    if (reviewerId === "admin") {
      axios
        .get(`${DOMAIN}/getreviewertask`)
        .then(response => {
          const allTasks = response.data
          const filteredArray = allTasks.filter(item1 => {
            return reviewers.some(item2 => {
              return item1.task_role === item2.profile_role
            })
          });
          setData(filteredArray)
        })
        .catch(error => console.error(error));

      console.log("record is:", reviewerIdInfo)
    } else {
      axios
        .get(`${DOMAIN}/getreviewertask`, {
          "assignedTo": reviewerIdInfo
        })
        .then(response => {
          console.log("Response data is:", response.data);
          const allTasks = response.data
          const filteredArray = allTasks.filter(item1 => {
              return item1.profile_id === reviewerIdInfo && item1.task_status !== 'Reassigned'  && item1.task_status !== 'Pass';
          });
          setData(filteredArray)
          // setData(response.data)
        })
        .catch(error => console.error(error));
    }
  }

  let columns = [
    {
      title: 'Task ID',
      dataIndex: 'task_id',
      key: 'key'
    },
    {
      title: 'Task Title',
      dataIndex: 'task_title',
      key: 'key'
    },
    {
      title: 'Assign To',
      dataIndex: 'profile_username',
      key: 'key',
    },
    {
      title: 'Status',
      dataIndex: 'task_status',
      key: 'key',

      render: (text, record) => (
        <Select defaultValue={text} style={{ width: 120 }} onChange={(value) => handleStatusChange(record, value, text)}>
          <Option key="1" value="Fail" >Fail </Option>
          <Option key="2" value="Pending" disabled>Waiting for Review </Option>
          <Option key="3" value="Pass" >Pass</Option>

        </Select>
      )
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'key'
    }
  ]

  useEffect(() => {
    getReviewers();
  }, []);

  const showAlert = () => {
    Swal.fire({
      title: '',
      text: 'Status updated succesfully',
      icon: 'Record added successfully',
      confirmButtonText: 'OK',
    });
  };

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
        }}
      >
      
        <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
          StartWorking
        </Button>
        <span
          style={{
            marginRight: 8,
          }}
        >
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
        </span>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} pagination={{ pageSize: 4 }} />
    </div>
  );
};
export default ReviewerData;