import { Button, Table, Select } from 'antd';
import React, { useState } from 'react';
import 'antd/dist/antd.min.css';
import { ROLES } from './ROLES.js';
import useAuth from '../hooks/useAuth.js';
import axios from "axios";
import { useEffect } from 'react';

const { Option } = Select;



const ReviewerData = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();
  const reviewerId = auth.username;

  let [data, setData] = useState([])
  const [selectedStatus, setSelectedStatus] = useState("");


  const handleStatusChange = (record, value, text) => {
    console.log("value is:", value);
    setSelectedStatus(value);
    axios
      .put("http://localhost:5000/updatetask", {
        "id": record._id,
        "updatedData": { "status": value }
      })
      .then(response => {
        console.log("response handlechange data is:", response);

      })
      .catch(error => console.error(error));

  }

  let columns = [
    {
      title: 'Task Title',
      dataIndex: 'taskTitle',
      key: 'key'
    },
    {
      title: 'Task ID',
      dataIndex: 'taskId',
      key: 'key'
    },
    {
      title: 'Assign To',
      dataIndex: 'assignedTo',
      key: 'key',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'key',

      render: (text, record) => (
        <Select defaultValue={text} style={{ width: 120 }} onChange={(value) => handleStatusChange(record, value, text)}>


          <Option key="1" value="In Progress" >fail </Option>
          <Option key="2" value="Completed" >Waiting for Review </Option>
          <Option key="3" value="Waiting for Review" >pass</Option>

        </Select>
      )
    },
    {
      title: 'Created Date',
      dataIndex: 'creationDate',
      key: 'key'
    },


  ]

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

  // const getTask = () => {

  //   axios
  //     .get("http://localhost:5000/completedtasks")
  //     .then(response => {
  //       // if(response.data.assignedTo=== reviewerId){
  //       console.log("Response data:", response.data);
  //       setData(response.data)
  //     })
  //     .catch(error => console.error(error));
  // }

  // useEffect(() => {
  //   getTask();
  // }, []);
  // const [reviewers, setReviewers] = useState([]);

  const getReviewers = () => {

    axios
      .get("http://localhost:5000/allprofiles")
      .then(response => {

        const allProfiles = response.data
        console.log("response data is for reviewer", response.data);

        const reviewerlist = allProfiles.filter((item) => {
          return item.role === "Reviewer"
        })

        console.log("reviewer list is", reviewerlist);
        // setReviewers(reviewerlist)
        getTask(reviewerId, reviewerlist)
      })
      .catch(error => console.error(error));
  }

  const getTask = (reviewerIdInfo, reviewers) => {
    if (reviewerId === "admin") {
      axios
        .get("http://localhost:5000/getalltask")
        .then(response => {
          // console.log("Response data:", response.data, "reviewer data is:", reviewers);
          const allTasks = response.data
          const filteredArray = allTasks.filter(item1 => {

            return reviewers.some(item2 => {
              // console.log("item1 is:", item1, "item2 is:", item2);

              return item1.assignedTo === item2.username
            })

          });
          setData(filteredArray)
          console.log("tasklist  is:", filteredArray)
        })
        .catch(error => console.error(error));

      console.log("record is:", reviewerIdInfo)
    }
    else {
      axios
        .post("http://localhost:5000/taskbyfilter", { "assignedTo": reviewerIdInfo })
        .then(response => {
          console.log("Response data is:", response.data);
          setData(response.data)
        })
        .catch(error => console.error(error));
    }
  }

  useEffect(() => {
    getReviewers();
  }, []);

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