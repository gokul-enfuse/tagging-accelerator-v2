import { Button, Table, Select } from 'antd';
import React, { useState } from 'react';
import 'antd/dist/antd.min.css'
import { ROLES } from './ROLES.js';
import useAuth from '../hooks/useAuth.js';
import axios from "axios";
import { useEffect } from 'react';


const { Option } = Select;
const handleStatusChange = (record, value, text) => {
  console.log("value is:", value);
  axios
    .put("http://localhost:5000/updatetask", {
      "id": record._id,
      "updatedData": { "status": value }
    })
    .then(response => {
      console.log("response handlechange data is:", response);

    })
    .catch(error => console.error(error));

}
let columns = [
  {
    title: 'Task Title',
    dataIndex: 'taskTitle',
    key: 'key'
  },
  {
    title: 'Task ID',
    dataIndex: 'taskId',
    key: 'key'
  },
  {
    title: 'Assign To',
    dataIndex: 'assignedTo',
    key: 'key',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'key',

    render: (text, record) => (
      <Select defaultValue={text} style={{ width: 120 }} onChange={(value) => handleStatusChange(record, value, text)}>
        <Option value="In Progress">in progress</Option>
        <Option value="Completed">Completed</Option>
        <Option value="Waiting for Review">Waiting for Review</Option>

      </Select>
    )
  },
  {
    title: 'Created Date',
    dataIndex: 'creationDate',
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
  console.log('role:', auth.role, ', columns: ', columns);

  // columns= columns.filter((columnitem) => {
  //  return columnitem.title !== 'Assign To'

  // })
  const getTask = () => {

    axios
      .get("http://localhost:5000/getalltask")
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