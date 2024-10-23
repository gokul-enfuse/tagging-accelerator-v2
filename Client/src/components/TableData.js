import { Button, Table, Select } from 'antd';
import React, { useState } from 'react';
import 'antd/dist/antd.min.css'
import { ROLES } from './ROLES.js';
import useAuth from '../hooks/useAuth.js';
import axios from "axios";
import { useEffect } from 'react';
import { DOMAIN } from '../Constant.js';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';

const { Option } = Select;
const handleStatusChange = (record, value, text) => {
  
  const showAlert = () => {
    Swal.fire({
      title: '',
      text: 'Success',
      icon: 'Record added successfully',
      confirmButtonText: 'OK',
    });
  };
  axios
    .put(`${DOMAIN}/updatetask/${record.task_id}`, {
      task_title: record.task_title,
      task_status: value,
      profile_id: record.profile_id,
      task_role: record.task_role
    })
    .then(response => {
      showAlert(response.data.message);
    })
    .catch(error => console.error(error));

}
let columns = [
  {
    title: 'Task ID',
    dataIndex: 'task_id',
    key: 'task_id'
  },
  {
    title: 'Task Title',
    dataIndex: 'task_title',
    key: 'task_title'
  },
  {
    title: 'Assign To',
    dataIndex: 'profile_username',
    key: 'profile_username',
  },
  {
    title: 'Status',
    dataIndex: 'task_status',
    key: 'task_status',

    render: (text, record) => (
      <Select defaultValue={text} style={{ width: 120 }} onChange={(value) => handleStatusChange(record, value, text)}>
         {/* <Option key={1} value="In Progress">in progress</Option>
        <Option key={2} value="Completed">Completed</Option>
        <Option key={3} value="Waiting for Review">Waiting for Review</Option>*/}

      </Select>
    )
  },
  {
    title: 'Created Date',
    dataIndex: 'createdDate',
    key: 'createdDate'
  },

]
 
const TableData = ({ selectedProject }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();
  let [data, setData] = useState([])
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
  const getTask = (record) => {
    axios
      .get(`${DOMAIN}/gettaskbyproject/${selectedProject}`)
       
      .then(response => {
        const filteredData = response.data.filter(task => task.task_status !== "Done" && task.task_status !== "Done");
        const finalData = filteredData.map((elem,idx)=>{
          return {...elem,'task_id':idx+1}
        })
        setData(finalData)
      })
      .catch(error => console.error(error));
  }

  useEffect(() => {
    getTask();
  }, [selectedProject]);


  return (
    <div style={{overflow:'hidden'}}>
      {/* <div
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
      </div> */}
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />
    </div>
  );
};
export default TableData;