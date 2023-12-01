import { Button, Table, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.min.css';
import { ROLES } from './ROLES.js';
import useAuth from '../hooks/useAuth.js';
import axios from "axios";
import { DOMAIN } from '../Constant.js';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import { useLocation } from 'react-router-dom'

const { Option } = Select;

const TaggerData = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();
  const taggerId = auth.profile_username === "admin" ? auth.profile_username : auth.profile_id;
  const [data, setData] = useState([]);
  const [url, setUrl] = useState("");
  let currentPort;

  const location = useLocation();

  const currentURL = window.location.href;
  const porturl = new URL(currentURL);
  const appPort = porturl.port;

  console.log("port:", appPort);


  const columnsRow = [
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
      render: (text, pname) => (
        <AssignTo pname={pname} />
      )
    },
    {
      title: 'No Of Images',
      dataIndex: 'task_filename',
      key: 'key',
      render: (text, record) => {
        try {
          if (record.task_filename) {
            console.log("record.task_filedata:", record.task_filename)
            //const taskData = JSON.parse(record.task_filedata.replace(/\\/g, '/')); 
            const taskData = [];
            taskData.push(record.task_filename);
            console.log("record:", record);

            console.log("updatedTaskData:", taskData.length)
            const numImages = taskData.length;
            const otherAppUrl = `http://localhost:3002/${record.profile_id}/${record.task_mediatype}?username=${taggerId}&taggerName=${record.profile_fullname}`;
            return (
              <a href={otherAppUrl} target="_blank">
                {numImages}
              </a>
            );
          }
          return 0;
        } catch (error) {
          console.error("Error parsing JSON:", error);
          return 0; // or display an error message
        }
      },
    },

    {
      title: 'Status',
      dataIndex: 'task_status',
      key: 'key',
      render: (text, record) => (
        <StatusSelect record={record} />
      )
    },

    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'key'
    },
  ];

  const AssignTo = ({ pname }) => {
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
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...formData,
        [name]: value,
      }));
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

    return (
      <select name="assignedTo" id="assignedTo" value={formData.assignedTo} onChange={handleChange} style={{ width: '150px', height: '30px' }}>
        {/* <option key={0} value={0}>
                          Select
                      </option> */}
        {(taggers.length > 0 && taggers.map((tagger) => (
          <option key={tagger.profile_id} value={tagger.profile_id}>
            {tagger.profile_username}
          </option>
        )))}</select>
    );
  }

  const StatusSelect = ({ record }) => {
    const [taskStatus, setTaskStatus] = useState({});
    const [data, setData] = useState([])

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
      const showAlert = () => {
        Swal.fire({
          title: '',
          text: 'Status changed succesfullly',
          icon: 'Record added successfully',
          confirmButtonText: 'OK',
        });
      };
      // Update the task status in the backend
      axios
        .put(`${DOMAIN}/updatetask/${record.task_id}`, {
          record: { ...record, task_status: "Completed", reviewer_task_status: "Waiting for review" },
        })
        .then((response) => {
          console.log("Response data:", response.data);
          showAlert(response.data.message);

          // Remove the completed task from the tagger list
          const updatedData = data.filter((task) => task.task_id !== record.task_id);
          setData(updatedData);
        })
        .catch((error) => console.error(error));
    };

    axios.post(`${DOMAIN}/storePort`, { port: appPort })
      .then((response) => {
        console.log("appPort:", appPort);
        // Handle the response if needed
        console.log("Port stored in the backend:", response.data);
      })
      .catch((error) => {
        console.error("Error storing port in the backend:", error);
        // Handle the error as needed
      })

    return (
      <Select
        value={taskStatus[record.task_id]}
        style={{ width: 120 }}
        onChange={handleStatusChange}
      >
        <Option value="Reassigned" disabled>
          reassigned
        </Option>
        <Option value="Completed">Completed</Option>
        <Option value="Done" disabled>
          Task done
        </Option>
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
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const getTaggers = () => {
    axios
      .get(`${DOMAIN}/getalltaggers`)
      .then((response) => {
        const allProfiles = response.data;
        console.log("response data is for reviewer", allProfiles);
        getTask(taggerId, allProfiles);
      })
      .catch((error) => console.error(error));
  };

  const getTask = (taggerIdInfo, taggers) => {
    console.log("taggerId:", taggerId);
    console.log("taggerIdInfo:", taggerIdInfo);
    console.log("auth.role:", auth.profile_role);


    if (taggerId === "admin" || auth.profile_role === 2) {
      axios
        .get(`${DOMAIN}/getalltask`)
        .then((response) => {
          console.log("Response data all task:", response.data, "tagger data is:", taggers);
          const allTasks = response.data;
          const filteredArray = allTasks.filter((item1) => {
            return taggers.some((item2) => {
              console.log("item1 is:", item1, "item2 is:", item2);
              return item1.profile_id === item2.profile_id && item1.task_status !== "Completed" && item1.task_status !== "Pass" && item1.task_status !== "waiting for review";

            });
          });
          setData(filteredArray);
          // console.log("first element:",(filteredArray[0].task_filedata).length )
          console.log("json:", (JSON.parse((filteredArray[0].task_filedata))).length)
          console.log("tasklist is:", filteredArray);
        })
        .catch((error) => console.error(error));
      console.log("record is:", taggerIdInfo);
    } else {
      console.log("taggerIdInfo:", taggerIdInfo);
      axios
        .post(`${DOMAIN}/taskbyfilter`, {
          assignedTo: taggerIdInfo,
        })
        .then((response) => {
          console.log("Response data is:", response.data);
          const allTasks = response.data;
          const filteredArray = allTasks.filter((item1) => {
            console.log("response.data:", response.data)
            return item1.profile_id === taggerIdInfo && item1.task_status !== "Completed" && item1.task_status !== "Pass" && item1.task_status !== "waiting for review";
          });
          setData(filteredArray);

        })
        .catch((error) => console.error(error));
    }
  };
  useEffect(() => {
    getTaggers();
  }, []);

  console.log("Data in TaggerData component:", data);

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
        pagination={{ pageSize: 4 }}
      />
    </div>
  );
};

export default TaggerData;