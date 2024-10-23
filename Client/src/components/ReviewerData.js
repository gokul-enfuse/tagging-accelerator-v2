import { Table, Select } from 'antd';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import axios from "axios";
import { useEffect } from 'react';
import { DOMAIN, DOMAINCLIENT } from '../Constant.js';
import 'antd/dist/antd.min.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import { AssignToReviewer, PriprityLevel } from '../utilities/Assignto.js';
import usePageVisibility from '../utilities/usePageVisibility';

const ReviewerData = ({searchValue}) => {
  const { Option } = Select;
  const { auth } = useAuth();
  const reviewerId = (auth.profile_username === "admin") ? auth.profile_username : auth.profile_id;
  let [data, setData] = useState([])
  const [mismatchedTasks, setMismatchedTasks] = useState([]);
  const [portNumber, setPortNumber] = useState();
  let location = useLocation();
  let currentURL = window.location.href;
  let porturl = new URL(currentURL);
  let appPort = porturl.port;
  const [finalData,setFinalData] = useState([]);

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
        <AssignToReviewer pname={pname} record={record} mismatchedTasks={mismatchedTasks} />
      )
    },
    {
      title: 'No Of Items',
      dataIndex: 'task_filename',
      key: 'noOfItems',
      render: (text, record) => {
        try {
          let numItems = (record.numimage > 0)? record.numimage : record.numdocs; 
          const reviewerAppUrl = `${DOMAINCLIENT}/${record.reviewer_profile_id}/${record.task_mediatype}?roleid=${auth.profile_role}&username=${reviewerId}`;
          return (
            <a href={reviewerAppUrl} target="_blank">{numItems}</a>
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
      title: 'Status',
      dataIndex: 'task_status',
      key: 'taskStatus',
      render: (text, record) => (
        <StatusSelect record={record} />
      )
    },
    {
      title: 'Priority Level',
      dataIndex: 'task_prioroty',
      key: 'priorotyLevel',
      render: (text, record) => (
         <PriprityLevel record={record}/>
      )
    },
    {
      title: 'Modified Date',
      dataIndex: 'modifiedDate',
      key: 'modified_Date'
    },
    {
      title: 'Task Completion Date',
      dataIndex: 'task_completedDate',
      key: 'task_completedDate'
    },
  ]

/**
 * Related function definations
 * Created Date: 28/02/2024
 * Created By:: Vikas Bose
 */
  const showAlert = (arg, icon) => {
    Swal.fire({
      title: arg,
      text: 'Status updated succesfully',
      icon: icon,
      confirmButtonText: 'OK',
    });
  };

  const getReviewersTask = () => {
    axios
      .get(`${DOMAIN}/getreviewertask`, {
          params: {
            profile_id: auth.profile_id,
            profile_role: auth.profile_role
          }
      })
      .then(response => {
        setData(response.data);
        setFinalData(response.data)
      }).catch(error => 
        console.error(error)
      );
  };

  const StatusSelect = ({ record }) => {
    const [taskStatus, setTaskStatus] = useState({});
    const [data, setData] = useState([]);

    useEffect(() => {
      setTaskStatus((prevState) => ({
        ...prevState,
        [record.task_id]: record.task_status || "Waiting for review"
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
          showAlert(response.data.message, 'info');
          const updatedData = data.filter((task) => task.task_id !== record.task_id);
          setData(updatedData);
          getReviewersTask();
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

  useEffect(()=>{
    if(searchValue!=''){
    const newData = data.filter((item)=>{
      return item.profile_email.includes(searchValue);
    })
    setFinalData(newData);
    }else{
      setFinalData(data);
    } 
  },[searchValue])

  useEffect(() => {
    getReviewersTask();
  }, []);  

  usePageVisibility(() => {
    getReviewersTask();
  });

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
        dataSource={finalData} 
        pagination={{ pageSize: 10 }} 
      />
    </div>
  );
};

export default ReviewerData;
