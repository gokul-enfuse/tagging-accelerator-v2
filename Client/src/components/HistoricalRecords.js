import { Table } from 'antd';
import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.min.css';
import axios from "axios";
import { DOMAIN } from '../Constant';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import SearchBar from './SearchBar';
import {Model} from '../utilities/Model';
import usePageVisibility from '../utilities/usePageVisibility';
import useAuth from '../hooks/useAuth';

const HistoricalRecords = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState({});
  const [open, setOpen] = useState(false);
  const [taskid, setTaskId] = useState();
  const [searchValue,setSearchValue] = useState('');
  const [finalData,setFinalData] = useState([]);
  const { auth} = useAuth();
  
  useEffect(() => {
    fetchHistoricalRecords();  // Initial data fetch
  }, []);

  usePageVisibility(() => {
    fetchHistoricalRecords();
  });

  const fetchHistoricalRecords = () => {
    axios.get(`${DOMAIN}/api/historicalRec`)
      .then(res => {
         setData(res.data);
         setLoading(false);
         setFinalData(res.data);
      }).catch(error => {
         console.error(error);
      });
  };
  const refreshData = () => {
    fetchHistoricalRecords();
  };
  
  useEffect(()=>{
    if(searchValue!=''){
    const newData = data.filter((item)=>{
      return item.tagger.includes(searchValue);
    })
    setFinalData(newData);
  }else{
    setFinalData(data);
  }
  },[searchValue])

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
        return (<button style={{width: '55px', height: '30px', margin: '0px',fontSize:'18x',background:"#09deb0dc", cursor:'pointer'}} onClick={showModelBox} id={combineId}>Edit</button>);
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
  useEffect(()=>{
    if(searchValue!=''){
    const newData = data.filter((item)=>{
      return item.tagger.includes(searchValue);
    })
    setFinalData(newData);
    }else{
      setFinalData(data);
    } 
  },[searchValue])

  return (
    <div>
      <div>
        <SearchBar setSearchValue={setSearchValue} />
      </div>
    
    <div>

      <div>
        <h1 style={{ marginBottom: '5px', textAlign: 'center',color:'white', alignItems: 'center', marginTop: 5,fontSize:'22px' }}>
        Welcome {(auth.profile_name !== 'null') ? auth.profile_name : auth.profile_username} - Historical Records Page
        </h1>
        <div style={{ overflowY: 'auto', height: '356px' }}>
          <Table columns={columns} dataSource={finalData} loading={loading} pagination={{ pageSize: 10 }} rowKey="task_id" />            
        </div>
        <Model open={open} handleClose={handleClose} taskId={taskid} refreshData={refreshData}/>
      </div>
    </div>
    </div>
  );
};

export default HistoricalRecords;
