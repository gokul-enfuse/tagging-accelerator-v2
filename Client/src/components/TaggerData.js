import { Button, Table, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth.js';
import axios from "axios";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import { useLocation } from 'react-router-dom';
import 'antd/dist/antd.min.css';
import { DOMAIN } from '../Constant.js';
import { ROLES } from './ROLES.js';


const TaggerData = () => {
  const { Option } = Select;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();
  const taggerId = auth.profile_username === "admin" ? auth.profile_username : auth.profile_id;
  const [data, setData] = useState([]);
  const [url, setUrl] = useState("");
  const [mismatchedTasks, setMismatchedTasks] = useState([]);
  const [portNumber, setPortNumber] = useState();
  let location = useLocation();
  let currentURL = window.location.href;
  let porturl = new URL(currentURL);
  let appPort = porturl.port;
  
  const columnsRow = [
    
    {
      title: 'Folder Title',
      dataIndex: 'task_folder_name',
      key: 'taskFolderName'
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
          let numImages = 0;

          if (auth.profile_role === 3 ||auth.profile_role === 1 ||auth.profile_role === 2) {
            numImages = record.numimage || 0; }

          const otherAppUrl = `http://localhost:${portNumber}/${record.profile_id}/${record.task_mediatype}?roleid=${auth.profile_role}&username=${taggerId}`;
          return (
            <a href={otherAppUrl} target="_blank">
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
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate'
    },
  ];

  const StatusSelect = ({ record }) => {
    const [taskStatus, setTaskStatus] = useState({});
    const [data, setData] = useState([]);
    
    useEffect(() => {
      setTaskStatus((prevState) => ({
        ...prevState,
        [record.task_id]: record.task_status || "Todo"
      }));
    }, [record]);

    const [completedTaskIds, setCompletedTaskIds] = useState([]);
    
    const handleStatusChange = (value) => {
      record.task_status = value;
      const updatedTaskStatus = { ...taskStatus, [record.task_id]: value };
      setTaskStatus(updatedTaskStatus);
      if (value === "Completed") {
        setCompletedTaskIds([...completedTaskIds, record.task_id]);
      }
      const showAlert = (arg) => {
        Swal.fire({
          title: 'Alter Message',
          text: arg,
          icon: '',
          confirmButtonText: 'OK',
        });
      };
      // Update the task status in the backend
      axios
        .put(`${DOMAIN}/updatetask/${record.task_id}`, {
          record: { ...record, task_status: value, reviewer_task_status: (value === 'Done')?"Waiting for review" : null },
        })
        .then((response) => {
          showAlert(response.data.message);
          // Remove the completed task from the tagger list
          const updatedData = data.filter((task) => task.task_id !== record.task_id);
          setData(updatedData);
        })
        .catch((error) => console.error(error));
    };

    /* axios.post(`${DOMAIN}/storePort`, { port: appPort })
      .then((response) => {
        // Handle the response if needed
        console.log("Port stored in the backend:", response.data);
      })
      .catch((error) => {
        console.error("Error storing port in the backend:", error);
      }) */

    return (
      <Select
        value={taskStatus[record.task_id]}
        style={{ width: 120 }}
        onChange={handleStatusChange}
      >
        <Option value="Reassigned" disabled>reassigned</Option>
        <Option value="Processed">In Process</Option>
        <Option value="Completed" disabled>Completed</Option>
        <Option value="Done" disabled>Task done</Option>
      </Select>
    );
  };

  const start = () => {
    setLoading(true);
    // ajax request after empty completing
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

  const getTaggers = () => {
    axios
      .get(`${DOMAIN}/gettaggertask`)
      .then((response) => {
        const taggerTasks = response.data;
        setData(taggerTasks);
      })
      .catch((error) => console.error(error));
  };

  const showCustomeAlert = (error) => {
    Swal.fire({
      title: '',
      text: error,
      icon: 'Record added successfully...',
      confirmButtonText: 'OK',
    });
  };
  useEffect(() => {
     getTaggers();

    axios.get(`${DOMAIN}/getPort?appName=tagging-toolV2`)
      .then(result => {
        setPortNumber(result['data'].appPort);
      }).catch(error => {
        showCustomeAlert(error)
      })
  }, []);

  const AssignTo = ({ pname, record, mismatchedTasks }) => {
    const defaultFormData = {
      taskTitle: '',
      taskId: '',
      status: 'To do',
      assignedProject: '',
      assignedTo: '',
      reviewer_profile_id: '',
      role: 3,
      creationDate: '',
      mediaType: '',
      fileName: '',
      filePath: ''
    }
    const [formData, setFormData] = useState(defaultFormData);
    const [taggers, setTaggers] = useState([]);

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

    const getTaggers = () => {
      axios
        .get(`${DOMAIN}/getalltaggers`)
        .then(res => {
          const allProfiles = res.data;
          setTaggers(allProfiles);
        }).catch(error => console.error(error));
    }
    useEffect(() => {
      getTaggers();
    }, []);
    const findTaggerById = (profileId) => taggers.find(tagger => tagger.profile_id === profileId);

    const isIndividualLogin = auth.profile_role !== 1 && auth.profile_role !== 2;
    return (
      <select
        name="assignedTo"
        id="assignedTo"
        value={formData.assignedTo || findTaggerById(record.profile_id)?.profile_id || ''}
        onChange={handleChange}
        style={{ width: '150px', height: '30px' }}
        disabled={isIndividualLogin} 
      >
        <option value="">Select</option>
        {taggers.length > 0 &&
          taggers.map((tagger) => (
            <option
              key={tagger.profile_id}
              value={tagger.profile_id}
            >
              {tagger.profile_username}
            </option>
          ))}
      </select>
    )

  }

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
      <Table
        rowSelection={rowSelection}
        columns={columnsRow}
        dataSource={data}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default TaggerData;