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
  console.log("value is:", value, record);
  axios
    .put(`${DOMAIN}/updatetask/${record.task_id}`, {
      task_title: record.task_title,
      task_status: value,
      profile_id: record.profile_id,
      task_role: record.task_role
    })
    .then(response => {
      console.log("response handlechange data is:", response);
      showAlert(response.data.message);
    })
    .catch(error => console.error(error));

}
let columns = [
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
  },
  {
    title: 'Status',
    dataIndex: 'task_status',
    key: 'key',

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
    key: 'key'
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
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);

  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  console.log('role:', auth.profile_role, ', columns: ', columns);
  const getTask = (record) => {

    axios
      .get(`${DOMAIN}/gettaskbyproject/${selectedProject}`)
       
      .then(response => {
        console.log("Response data:", response.data);
        

        console.log("selectedProject table:", selectedProject);
        const filteredData = response.data.filter(task => task.task_status !== "Pass" && task.task_status !== "Pass");
        setData(filteredData)
        console.log("filteredData:", filteredData);
      })
      .catch(error => console.error(error));
  }

  useEffect(() => {
    getTask();
  }, [selectedProject]);


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
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} pagination={{ pageSize: 2 }} />
    </div>
  );
};
export default TableData;