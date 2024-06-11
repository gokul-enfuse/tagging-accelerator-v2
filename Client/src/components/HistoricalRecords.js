import { Table } from 'antd';
import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.min.css';
import axios from "axios";
import { DOMAIN } from '../Constant';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import SearchBar from './SearchBar';
import Model from '../utilities/Model';


const HistoricalRecords = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState({});
  const [open, setOpen] = useState(false);
  const [taskid, setTaskId] = useState();
  
  useEffect(() => {
     axios.get(`${DOMAIN}/api/historicalRec`)
      .then(res => {
         setData(res.data);
         setLoading(false);
      }).catch(error => {
         console.log(error)
      });
  }, []);

  const columns = [
    {
      title: 'Forlder Title',
      dataIndex: 'task_folder_name',
      key: 'task_folder_name',
    },
    {
      title: 'Task status',
      dataIndex: 'task_status',
      key: 'task_status',
    },
    {
      title: 'Project Name',
      dataIndex: 'project_name',
      key: 'project_name',
    },
    {
      title: 'Tagger User ID',
      dataIndex: 'tagger',
      key: 'profile_id',
    },
    {
      title: 'Reviewer User ID',
      dataIndex: 'reviewer',
      key: 'reviewer_profile_id',
    },
    {
      title: 'Media Type',
      dataIndex: 'task_mediatype',
      key: 'task_mediatype',
    },
    {
      title: 'Process Type',
      dataIndex: 'task_process_type',
      key: 'task_process_type',
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, records) => { 
        let combineId = records.task_id+'_'+records.reviewer_profile_id;
        return (<button style={{width: 'auto', height: '40px', margin: '0px', fontSize:'20px'}} onClick={showModelBox} id={combineId}>Edit</button>);
      }
    }
  ];

  const showModelBox = (e) => {
    const {id} = e.target;
      setOpen(true);
      setTaskId(id);
  }
  const handleClose = () => setOpen(false);

  const showAlert = () => {
    Swal.fire({
      title: '',
      text: 'Selected tasks reassigned succesfully',
      icon: 'Success',
      confirmButtonText: 'OK',
    });
  };

  return (
    <div>
      <div>
        <SearchBar/>
      </div>
    
    <div>
      {/*<div style={{marginTop: "10px"}}>
         <label style={{ marginTop: 20, color: 'white' }}>Assign to a Tagger</label> &nbsp;&nbsp; */}
        {/* <select
        className='historicalrecords'
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
        </select> */}
        {/* {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
        <Button
          type="primary"
          onClick={handleTaskSubmit}
          disabled={!hasSelected || !assignedTo}
          style={{ marginTop: 10 }}
        >
          Submit
        </Button> 
      </div>*/}

      <div>
        <h1 style={{ marginBottom: '20px', textAlign: 'center', alignItems: 'center', marginTop: 26 }}>

        </h1>
        <div style={{ overflowY: 'scroll', height: '356px' }}>
          <Table columns={columns} dataSource={data} loading={loading} pagination={{ pageSize: 10 }} rowKey="task_id" />            
        </div>
        <Model open={open} handleClose={handleClose} taskId={taskid}/>
      </div>
    </div>
    </div>
  );
};

export default HistoricalRecords;
