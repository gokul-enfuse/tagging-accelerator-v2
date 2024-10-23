import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import useAuth from '../hooks/useAuth.js';
import ProfileData from './ProfileData.js';
import axios from "axios";
import SearchBar from './SearchBar.js';
import 'antd/dist/antd.min.css';
import {ModelReport} from '../utilities/Model';
import { DOMAIN } from '../Constant';


function Reports() {
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [taskMediaType, setTaskMediaType] = useState();
const [open, setOpen] = useState(false);
const [taskid, setTaskId] = useState();
const { auth } = useAuth();

useEffect(() => {
  axios.get(`${DOMAIN}/api/report-result`)
   .then(res => {
      setData(res.data);
      setTaskMediaType(res.data);
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
      title: 'Attached',
      dataIndex: 'attached',
      key: 'attached',
      render: (text, records) => {     
        let jsonFileUrl = process.env.PUBLIC_URL + `/Reports/Report${records.report_id}${records.task_id}${records.project_name}.json`;
        return (
           <div>
              <span><a href={`${jsonFileUrl}`} download={`Report${records.report_id}${records.task_id}${records.project_name}.json`}>Co-ordinate Report (JSON)</a></span><br/>
              <span><a href={"#"}>Co-ordinate Report (Yullo)</a></span>
           </div>
        )
      }
    },
    {
      title: 'Replaced Doc container',
      dataIndex: '',
      key: 'docvalue',
      render: (text, records) => {
        console.log(records);
        return ((records.task_mediatype === 'doc')?<div><img src={`${process.env.PUBLIC_URL}/icon/folder-docs.jpg`} style={{width: 35}} onClick={handleDocOPen}/></div>: '-');
      }
    }
  ];

  const handleDocOPen = (e) => {
    const {id} = e.target;
    console.log(e);
    setOpen(true);
    setTaskId(id);
  }
  const handleClose = () => setOpen(false);
    return (
      <div>
        <div>
            <SearchBar/>
        </div>
      
      <div>
      <h1 style={{ marginBottom: '5px', textAlign: 'center',color:'white', alignItems: 'center', marginTop: 5,fontSize:'22px' }}>
      Welcome {(auth.profile_name !== 'null') ? auth.profile_name : auth.profile_username} - Reports Page
      </h1>
      <div style={{ overflowY: 'auto', height: '400px' }}>
      {/* <ProfileData /> */}
          <Table columns={columns} dataSource={data} loading={loading} pagination={{ pageSize: 10 }} rowKey="task_id" />
      </div>
      <ModelReport open={open} handleClose={handleClose} taskId={taskid}/>
    </div>
    </div>
      
    )
}

export default Reports
