import { Button, Table, Select } from 'antd';
import React, { useState } from 'react';
import 'antd/dist/antd.min.css'
import { ROLES } from './ROLES.js';
import useAuth from '../hooks/useAuth.js';
import axios from "axios";
import { useEffect } from 'react';
const localhost = '52.44.231.112';

const { Option } = Select;
const handleStatusChange = (record, value, text) => {
  console.log("value is:", value, record);
  axios
    .put(`http://${localhost}:5000/updatetask/${record.task_id}`, {
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

const TableData = () => {
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
  const getTask = () => {

    axios
      .get("http://${localhost}:5000/getalltask")
      .then(response => {
        console.log("Response data:", response.data);
        setData(response.data)
      })
      .catch(error => console.error(error));
  }


  useEffect(() => {
    getTask();
  }, []);

  useEffect(() => {
    console.log(setData);
  }, [setData]);



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
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} pagination={{ pageSize: 4 }} />
    </div>
  );
};
export default TableData;