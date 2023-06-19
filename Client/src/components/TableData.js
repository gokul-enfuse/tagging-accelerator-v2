import { Button, Table, Select } from 'antd';
import React, { useState } from 'react';
import 'antd/dist/antd.min.css'
import { ROLES } from './ROLES.js';
import useAuth from '../hooks/useAuth.js';
import axios from "axios";
import { useEffect } from 'react';
import { DOMAIN } from '../Constant.js';


const { Option } = Select;
const handleStatusChange = (record, value, text) => {
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
      alert(response.data.message);
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
    dataIndex: 'profile_email',
    key: 'key',
  },
  {
    title: 'Status',
    dataIndex: 'task_status',
    key: 'key',

    render: (text, record) => (
      <Select defaultValue={text} style={{ width: 120 }} onChange={(value) => handleStatusChange(record, value, text)}>
        <Option key={1} value="In Progress">in progress</Option>
        <Option key={2} value="Completed">Completed</Option>
        <Option key={3} value="Waiting for Review">Waiting for Review</Option>

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
console.log("selectedProject tabledata:",selectedProject)
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

  // if (auth.role === ROLES.ADMIN || auth.role === ROLES.MANAGER) {
  //   data = data.map((item) => {
  //     item.assignTo = undefined
  //     return item
  //   })
  // }
  // console.log('role:', auth.role, ', data: ', data);

  // if (auth.role === ROLES.MANAGER || auth.role === ROLES.ADMIN) {
  //   console.log('columns1:', columns)
  //   columns = columns.filter((columnitem) => {
  //     console.log('columnitem:', columnitem)
  //     console.log('columns2:', columns)
  //     return columnitem.title !== 'Assign To'


  //   })
  // }
  console.log('role:', auth.profile_role, ', columns: ', columns);

  // columns= columns.filter((columnitem) => {
  //  return columnitem.title !== 'Assign To'

  // })
  const getTask = (record) => {

    axios
      .get(`${DOMAIN}/gettaskbyproject/${selectedProject}`)
       
      .then(response => {
        console.log("Response data:", response.data);
        console.log("selectedProject table:", selectedProject);
        setData(response.data)
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