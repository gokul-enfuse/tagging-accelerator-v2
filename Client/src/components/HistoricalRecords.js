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
    const fetchData = async () => {
      try {
        const taggerResponse = await axios.get(`${DOMAIN}/gettaggername`);
        const reviewerResponse = await axios.get(`${DOMAIN}/getreviewername`);

        const taggerTasks = taggerResponse.data.map(item => ({
          ...item,
          role: "Tagger",
          reviewerName: "",
          taggerName: item.profile_fullname, // Add taggerName field
        }));

        const reviewerTasks = reviewerResponse.data.map(item => ({
          ...item,
          role: "Reviewer",
        }));

        taggerTasks.forEach(taggerTask => {
          const matchingReviewerTask = reviewerTasks.find(reviewerTask => reviewerTask.task_id === taggerTask.task_id);
          if (matchingReviewerTask) {
            taggerTask.reviewerName = matchingReviewerTask.profile_fullname;
          }
        });

        const filteredTasks = taggerTasks.filter(
          task =>
            task.task_status === "Pass" &&
            task.task_status !== "reassigned" &&
            task.task_status !== "to do"
        );


        setData(filteredTasks);
        console.log("filtered task:", filteredTasks)
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    const getReviewers = () => {
      axios
        .get(`${DOMAIN}/allprofiles`)
        .then(response => {
          const allProfiles = response.data;
          const reviewerList = allProfiles.length > 0 && allProfiles.filter((item) => item.profile_role === 3);
          console.log("reviewer list is", reviewerList);
          setReviewerList(reviewerList);
        })
        .catch(error => console.error(error));
    };

    fetchData();
    getReviewers();
  }, []);

  const handleAssignToChange = (e) => {
    const selectedTaggerId = e.target.value;
    setAssignedTo(selectedTaggerId);
    console.log("assign to:", selectedTaggerId);
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
      title: 'Task ID',
      dataIndex: 'task_id',
      key: 'task_id',
    },
    {
      title: 'Task Title',
      dataIndex: 'task_title',
      key: 'task_title',
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
    },
    {
      title: 'Tagger',
      dataIndex: 'taggerName', // Use taggerName field instead of profile_fullname
      key: 'tagger',
      render: (text, record) => {
        if (record.role === 'Tagger') {
          return (
            <span>
              {text}
            </span>
          );
        }
        return null;
      },
    },
    {
      title: 'Reviewer',
      dataIndex: 'reviewerName',
      key: 'reviewer',
    },
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
      <div>
        <label style={{ marginTop: 20 }}>Assign to a Tagger</label><br />
        <select
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
        </select>
        {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
        <Button
          type="primary"
          onClick={handleTaskSubmit}
          disabled={!hasSelected || !assignedTo}
          style={{ marginTop: 10 }}
        >
          Submit
        </Button>
      </div>

      <div>
        <h1 style={{ marginBottom: '20px', textAlign: 'center', alignItems: 'center', marginTop: 26 }}>

        </h1>
        <div style={{ overflowY: 'scroll', height: '356px' }}>
          <Table columns={columns} dataSource={data} loading={loading} pagination={{ pageSize: 4 }} rowKey="task_id" rowSelection={rowSelection} />            </div>
      </div>
    </div>
    </div>
  );
};

export default HistoricalRecords;