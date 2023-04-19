import { Button, Table, Select } from 'antd';
import React, { useState } from 'react';
import 'antd/dist/antd.min.css';
import { ROLES } from './ROLES.js';
import useAuth from '../hooks/useAuth.js';
import axios from "axios";
import { useEffect } from 'react';
import { useRef } from 'react';


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
const columnsRow = [
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
       
        
      <Option  value="In Progress">reassigned</Option>
        <Option value="Completed" >Completed</Option>
        <Option value="Waiting for Review" >Task done</Option>

      </Select>
    )
  },
  {
    title: 'Created Date',
    dataIndex: 'creationDate',
    key: 'key'
  },

]


const TaggerData = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();
  const taggerId = auth.username;
  const [data, setData] = useState([])
  console.log("taggerId:", taggerId)
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

  // if (auth.role === ROLES.TAGGER || auth.role === ROLES.ADMIN) {
  //   data = data.map((item) => {
  //     item.assignTo = undefined
  //     return item
  //   })
  // }


  const getTaggers = () => {

    axios
      .get("http://localhost:5000/allprofiles")
      .then(response => {

        const allProfiles = response.data
        console.log("response data is for reviewer", response.data);

        const taggerlist = allProfiles.filter((item) => {
          return item.role === "Tagger"
        })

        console.log("tagger list is", taggerlist);
        // setReviewers(reviewerlist)
        getTask(taggerId, taggerlist)
      })
      .catch(error => console.error(error));
  }

  const getTask = (taggerIdInfo, taggers) => {
    if (taggerId === "admin") {
      axios
        .get("http://localhost:5000/getalltask")
        .then(response => {
          console.log("Response data:", response.data, "tagger data is:", taggers);
          const allTasks = response.data
          const filteredArray = allTasks.filter(item1 => {

            return taggers.some(item2 => {
              console.log("item1 is:", item1, "item2 is:", item2);

              return item1.assignedTo === item2.username
            })

          });
          setData(filteredArray)
          console.log("tasklist  is:", filteredArray)
        })
        .catch(error => console.error(error));

      console.log("record is:", taggerIdInfo)
    }
    else {
      axios
        .post("http://localhost:5000/taskbyfilter", { "assignedTo": taggerIdInfo })
        .then(response => {
          console.log("Response data is:", response.data);
          setData(response.data)
        })
        .catch(error => console.error(error));
    }
  }
  useEffect(() => {

    getTaggers();
  }, []);

  // const getFailedTask = () => {

  //   axios
  //     .get("http://localhost:5000/failedtasks")
  //     .then(response => {
  //       // if(response.data.assignedTo=== reviewerId){
  //       console.log("Response data:", response.data);
  //       setData(response.data)
  //     })
  //     .catch(error => console.error(error));
  // }

  // useEffect(() => {
  //   getFailedTask();
  // }, []);

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
      <Table rowSelection={rowSelection} columns={columnsRow} dataSource={data} pagination={{ pageSize: 4 }} />
    </div>
  );
};
export default TaggerData;