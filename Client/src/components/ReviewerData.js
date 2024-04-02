import { Button, Table, Select } from 'antd';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import axios from "axios";
import { useEffect } from 'react';
import { DOMAIN } from '../Constant.js';
import 'antd/dist/antd.min.css';
import { ROLES } from './ROLES.js';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';


const ReviewerData = () => {
  const { Option } = Select;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();
  const reviewerId = (auth.profile_username === "admin") ? auth.profile_username : auth.profile_id;
  let [data, setData] = useState([])
  const [mismatchedTasks, setMismatchedTasks] = useState([]);
  const [portNumber, setPortNumber] = useState();
  const [selectedStatus, setSelectedStatus] = useState("");
  let location = useLocation();
  let currentURL = window.location.href;
  let porturl = new URL(currentURL);
  let appPort = porturl.port;

  let columns = [
    {
      title: 'Task Folder',
      dataIndex: 'task_folder_name',
      key: 'taskFolderName',
      render: (text, record) => {
        const taskTitles = record.task_title.split(',');

        return (
          <div style={{ marginBottom: '8px', display: 'flex', flexWrap: 'wrap' }}>
            {taskTitles.map((titlePart, titleIndex) => (
              <div key={titleIndex} style={{ marginRight: '8px' }}>
                {titlePart}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      title: 'Assign To',
      dataIndex: 'profile_username',
      key: 'profileUsername',
      render: (text, record, pname) => (
        <AssignTo pname={pname} record={record} mismatchedTasks={mismatchedTasks} />
      )
    },
    {
      title: 'No Of Items',
      dataIndex: 'task_filename',
      key: 'noOfItems',
      render: (text, record) => {
        try {
          let numImages = record.numimage || 0;
          const reviewerAppUrl = `http://localhost:${portNumber}/${record.reviewer_profile_id}/${record.task_mediatype}?roleid=${auth.profile_role}&username=${reviewerId}`;
          return (
            <a href={reviewerAppUrl} target="_blank">
              {numImages}
            </a>
          );
        } catch (error) {
          console.error("Error rendering number of images:", error);
          return 0; // or display an error message
        }
      },
    },
    {
      title: 'Status',
      dataIndex: 'task_status',
      key: 'taskStatus',
      render: (text, record) => (
        <StatusSelect record={record} />
      )
    },
    {
      title: 'Modified Date',
      dataIndex: 'modifiedDate',
      key: 'modified_Date'
    }
  ]

/**
 * Related function definations
 * Created Date: 28/02/2024
 * Created By:: Vikas Bose
 */
  const showAlert = (arg) => {
    Swal.fire({
      title: arg,
      text: 'Status updated succesfully',
      icon: 'Record added successfully',
      confirmButtonText: 'OK',
    });
  };

  const getReviewersTask = () => {
    axios
      .get(`${DOMAIN}/getreviewertask`)
      .then(response => {
        setData(response.data);
      }).catch(error => 
        console.error(error)
      );
  };

  const start = () => {
    setLoading(true); // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const AssignTo = ({ pname, record, mismatchedTasks }) => {
    const defaultFormData = {
      taskTitle: '',
      taskId: '',
      status: 'waiting for review',
      assignedProject: '',
      assignedTo: '',
      reviewer_profile_id: '',
      role: 4,
      creationDate: '',
      mediaType: '',
      fileName: '',
      filePath: ''
    }
    const [formData, setFormData] = useState(defaultFormData);    
    let [reviewers, setReviewers] = useState([]);
    
    const handleChange = (e) => {
      const { value } = e.target;
      setFormData({
        assignedTo: value,
      });
      // Call the backend API to update the assignment
      axios
        .post(`${DOMAIN}/updateAssignment/${record.task_id}`, {
          record, assignedTo: value,
        })
        .then((response) => {
          console.log("Assignment updated successfully:", response.data);
        })
        .catch((error) => console.error("Error updating assignment:", error));
    };

    const getReviewers = () => {
      axios
        .get(`${DOMAIN}/getreviewername`)
        .then(res => {
          const allProfiles = res.data;
          setReviewers(allProfiles);
        }).catch(error => console.error(error));
    }
    useEffect(() => {
      getReviewers();
    }, []);

    const isIndividualLogin = auth.profile_role !== 1 && auth.profile_role !== 2;

    return (
      <select
        name="assignedTo"
        id="assignedTo"
        value={formData.assignedTo || record.reviewer_profile_id}
        onChange={handleChange}
        style={{ width: '150px', height: '30px' }}
        disabled={isIndividualLogin}>
        <option value="">Select</option>
        {reviewers.length > 0 &&
          reviewers.map((reviewer) => (
            <option key={reviewer.reviewer_profile_id} value={reviewer.reviewer_profile_id} > 
              {reviewer.profile_username}
            </option>
          ))}
      </select>
    )

  };

  const StatusSelect = ({ record }) => {
    const [taskStatus, setTaskStatus] = useState({});
    const [data, setData] = useState([]);

    useEffect(() => {
      setTaskStatus((prevState) => ({
        ...prevState,
        [record.task_id]: record.reviewer_task_status || "Waiting for review"
      }));
    }, [record]);    

    const handleStatusChange = (value) => {
      /* record.task_status = value;
      const updatedTaskStatus = { ...taskStatus, [record.task_id]: value };
        setTaskStatus(updatedTaskStatus);
      if (value === "Completed") {
        setCompletedTaskIds([...completedTaskIds, record.task_id]);
      } */
      
      // Update the task status in the backend
      axios
        .put(`${DOMAIN}/updatereviewertask/${record.task_id}`, {
          record: { ...record, task_role: (value === 'Reassigned')?3 : 4, task_status: value, reviewer_task_status: (value === 'Reassigned')?null:'Completed'},
        })
        .then((response) => {
          showAlert(response.data.message);
          const updatedData = data.filter((task) => task.task_id !== record.task_id);
          setData(updatedData);
        })
        .catch((error) => console.error(error));
    };

    return (
      <Select
        value={taskStatus[record.task_id]}
        style={{ width: 120 }}
        onChange={handleStatusChange}
      >
        <Option value="Reassigned" >Reassigned</Option>
        <Option value="waiting for review" disabled>Waiting for Review </Option>
        <Option value="Completed" >Completed</Option>
      </Select>
    );
  };


  useEffect(() => {
    getReviewersTask();

    axios.get(`${DOMAIN}/getPort?appName=tagging-toolV2`)
      .then(result => {
        setPortNumber(result['data'].appPort);
      }).catch(error => {
        showAlert(error)
      })
  }, []);  

  return (
    <div>
      {/* <div
        style={{
          marginBottom: 16,
        }}
      >
        <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
          StartWorking
        </Button>
        <span style={{marginRight: 8}}>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
        </span>
      </div> */}
      <Table 
        //rowSelection={rowSelection} 
        columns={columns} 
        dataSource={data} 
        pagination={{ pageSize: 5 }} 
      />
    </div>
  );
};

export default ReviewerData;
