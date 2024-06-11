import { Table, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth.js';
import axios from "axios";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import 'antd/dist/antd.min.css';
import { DOMAIN } from '../Constant.js';
import { AssignToTagger } from '../utilities/Assignto.js';


const TaggerData = () => {
  const { Option } = Select;
  const { auth } = useAuth();
  const taggerId = auth.profile_username === "admin" ? auth.profile_username : auth.profile_id;
  const [data, setData] = useState([]);
  const [portNumber, setPortNumber] = useState();
  let currentURL = window.location.href;
  let porturl = new URL(currentURL);
  let appPort = porturl.port;
  //let location = useLocation();
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
        <AssignToTagger pname={pname} record={record} />
      )
    },
    {
      title: 'No Of Items',
      dataIndex: 'task_filename',
      key: 'noOfItems',
      render: (text, record) => {
        try {
            let numItems = (record.numimage > 0)? record.numimage : record.numdocs; 

          const otherAppUrl = `http://localhost:${portNumber}/${record.profile_id}/${record.task_mediatype}?roleid=${auth.profile_role}&username=${taggerId}`;
          return (
            <a href={otherAppUrl} target="_blank">
              {numItems}
            </a>
          );
        } catch (error) {
          console.error("Error rendering number of images:", error);
          return 0; // or display an error message
        }
      },
    },

    {
      title: 'Process Type',
      dataIndex: 'task_process_type',
      key:'taskProcessType'
    },

    {
      title: 'Media Type',
      dataIndex: 'task_mediatype',
      key:'taskMediatype'
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

  return (
    <div>
      <Table
        //rowSelection={rowSelection}
        columns={columnsRow}
        dataSource={data}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default TaggerData;
