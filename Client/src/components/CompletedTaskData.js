import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import axios from "axios";
import { DOMAIN } from '../Constant.js';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';

const CompletedTaskData = () => {
  const [data, setData] = useState([]);
  const [reviewerList, setReviewerList] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [isSubmitted, setIsSubmitted] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  
  const getCompletedTasks = () => {
    axios
      .get(`${DOMAIN}/completedtasks`)
      .then(response => {
        setData(response.data)
      })
      .catch(error => console.error(error));
  }

  const getReviewers = () => {
    axios
      .get(`${DOMAIN}/getallreviewers`)
      .then(response => {
        setReviewerList(response.data)
      })
      .catch(error => console.error(error));
  }

  useEffect(() => {
    getCompletedTasks();
    getReviewers();
    setSelectedRowKeys([]);
  }, []);
  
  for (let i = 0; i < i.le; i++) {
    data.push({
      taskId: i,
      taskTitle: `task1 ${i}`,
      status: 'completed',
      creationDate: ` 5/6 ${i}`,
    });
  }
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  const handleTaskSubmit = () => { 
    selectedRowKeys.forEach(key => {
      const selectedRow = data.find(row => row.task_id === key);
      if (selectedRow) {
        const updatedRow = { ...selectedRow };
        updatedRow.reviewer_profile_id = assignedTo;
        updatedRow.profile_role = 4;
        updatedRow.task_role = 4;
        updatedRow.task_status = "waiting for review";

        axios
          .put(`${DOMAIN}/updatetask/${selectedRow.task_id}`, {
            id: selectedRow.task_id,
            record: updatedRow
          })
          .then(response => {
            let temp = { ...isSubmitted };
            temp[response.data._id] = true;
            setIsSubmitted(temp);
            showAlert();
          })
          .catch(error => console.error(error));
      }
    });
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
      title: 'Project Name',
      dataIndex: 'project_name',
      key: 'projectName',
      render: (text, records) => {
         try {
            return (
                <a>{records.project_name}</a>
            )
         } catch(error) {
            console.error("Error rendering number of images:", error);
         }
      }
    },
    {
      title: 'Status',
      dataIndex: 'task_status',
      key: 'status'
    },
    {
      title: 'Modified Date',
      dataIndex: 'modifiedDate',
      key: 'modifiedDate'
    },
  ];
  const handleAssignToChange = (e) => {
    setAssignedTo(e.target.value);
  };
  const showAlert = () => {
    Swal.fire({
      title: '',
      text: 'Success',
      icon: 'success',
      confirmButtonText: 'OK',
    });
  };

  
  return (
    <div className='completedTaskData'>
      <div>
        <label style={{ marginTop: 20, color:'white' }}>Assign to a reviewer</label><br />
        <select className='assignedToReviewer'
          name="assignedTo"
          style={{ width: '150px', height: '35px', border: '1px solid skyblue' }}
          value={assignedTo}
          onChange={handleAssignToChange}
        >
          <option key="0" value="">
            Select
          </option>
          {reviewerList && reviewerList.map((item) => (
            <option key={item.profile_id} value={item.profile_id}>
              {item.profile_username}
            </option>
          ))}
        </select>
      </div>
      {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
      <Button
        type="primary"
        onClick={handleTaskSubmit}
        disabled={!hasSelected || !assignedTo}
        style={{ marginTop: 10 }}
      >
        Submit
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 4 }}
        rowSelection={rowSelection}
        rowKey="task_id"
        // style={{height:100}}
      />
    </div>
  );
}

export default CompletedTaskData;
