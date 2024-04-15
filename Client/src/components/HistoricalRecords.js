import { Button, Table, Checkbox } from 'antd';
import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.min.css';
import axios from "axios";
import { DOMAIN } from '../Constant';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import SearchBar from './SearchBar';


const HistoricalRecords = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignedTo, setAssignedTo] = useState("");
  const [reviewerList, setReviewerList] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  useEffect(() => {
     axios.get(`${DOMAIN}/api/historicalRec`)
      .then(res => {
         console.log(res);
         setData(res.data);
         setLoading(false);
      }).catch(error => {
         console.log(error)
      });
  }, []);

  const handleAssignToChange = (e) => {
    const selectedTaggerId = e.target.value;
    setAssignedTo(selectedTaggerId);
  };
  const handleTaskSubmit = () => {
    selectedRowKeys.forEach((key) => {
      const selectedRow = data.find((row) => row.task_id === key);
      if (selectedRow) {
        const updatedRow = { ...selectedRow };
        updatedRow.tagger_id = assignedTo;
        // updatedRow.profile_role = 3;
        updatedRow.task_role = 3;
        updatedRow.task_status = "reassigned";

        // Update the task information
        axios
          .put(`${DOMAIN}/updatetask/${selectedRow.task_id}`, {
            id: selectedRow.task_id,
            record: updatedRow,
          })
          .then((response) => {
            let temp = { ...isSubmitted };
            temp[response.data.task_id] = true;
            setIsSubmitted(temp);
            showAlert("Success");
          })
          .catch((error) => console.error(error));
      }
    });
  };

  const hasSelected = selectedRowKeys.length > 0;
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

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
      dataIndex: 'profile_id',
      key: 'profile_id',
    },
    {
      title: 'Reviewer User ID',
      dataIndex: 'reviewer_profile_id',
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
        return (<a href='#'>Edit</a>);
      }
    }
  ];

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
      </div>
    </div>
    </div>
  );
};

export default HistoricalRecords;
