// import React, { useState, useEffect } from 'react';
// import { Table } from 'antd';
// import axios from "axios";
// import useAuth from '../hooks/useAuth.js';
// import { DOMAIN } from '../Constant.js';
// import Checkbox from './Checkbox.js';

// const CompletedTaskData = () => {
//     const { auth } = useAuth();
//     const [data, setData] = useState([]);
//     const [reviewerList, setReviewerList] = useState([]);
//     const [assignedTo, setAssignedTo] = useState("");
//     const [isSubmitted, setIsSubmitted] = useState({});

// const getCompletedTAsks = () => {
//     axios
//         .get(`${DOMAIN}/completedtasks`)
//         .then(response => {
//             console.log("Response data:", response.data);
//             setData(response.data)
//         }).catch(error => console.error(error));
// }
// const getReviewers = () => {
//     axios
//         .get(`${DOMAIN}/allprofiles`)
//         .then(response => {
//             const allProfiles = response.data
//             const reviewerList = allProfiles.length > 0 && allProfiles.filter((item) => item.profile_role === 4)
//             console.log("reviewer list is", reviewerList);
//             setReviewerList(reviewerList)
//         }).catch(error => console.error(error));
// }
// useEffect(() => {
//     getCompletedTAsks();
//     getReviewers();
// }, [])
// const handleAssignToChange = (taskId, e) => {
//     // const newAssignedTo = e.target.value;
//     setAssignedTo(e.target.value);
// };
// const handleTaskSubmit = (record) => {
//     // const task = data.find(task => task.taskId === record);
//     // const payload = { ...task, assignedTo: assignedTo };
//     record.reviewer_profile_id = assignedTo;
//     record.profile_role = 4 //assigned the role_id of reviewer 
//     record.task_role = 4 //assigned the role_id of reviewer 

//     axios
//         .put(`${DOMAIN}/updatetask/` + record.task_id, {
//             "id": record.task_id,
//             record
//         })
//         .then(response => {
//             let temp = isSubmitted;
//             temp[response.data._id] = true
//             setIsSubmitted(temp)
//             alert("success");
//         })
//         .catch(error => console.error(error));
// };
// const columns = [
//     {
//         title: 'Task ID',
//         dataIndex: 'task_id',
//         key: 'taskId'
//     },
//     {
//         title: 'Task Title',
//         dataIndex: 'task_title',
//         key: 'taskTitle'
//     },
//     {
//         title: 'Status',
//         dataIndex: 'task_status',
//         key: 'status'
//     },
//     {
//         title: 'Created Date',
//         dataIndex: 'createdDate',
//         key: 'creationDate'
//     },
//     // {
//     //     title: 'Assign To',
//     //     dataIndex: 'profile_id',
//     //     key: 'key',

//     //     render: (text, record) => (
//     //         <select name="assignedTo" value={assignedTo[record.profile_id]} onChange={(e) => handleAssignToChange(record.profile_id, e)} disabled={isSubmitted[record.profile_id]} style={{ width: '200px' }}>
//     //             <option key={""} value={""}>
//     //                 {record.assignedTo || "select"}
//     //             </option>
//     //             {reviewerList && reviewerList.map((reviewer) => (
//     //                 <option key={reviewer.profile_id} value={reviewer.profile_id}>
//     //                     {reviewer.profile_username}
//     //                 </option>
//     //             ))}
//     //         </select>
//     //     )
//     // },
//     // {
//     //     title: 'Action',
//     //     key: 'action',
//     //     render: (text, record) => (
//     //         <button
//     //             style={isSubmitted[record._id] ? { background: "grey" } : { background: "blue" }}
//     //             onClick={() => handleTaskSubmit(record)}
//     //             disabled={isSubmitted[record._id]}
//     //         >
//     //             Submit
//     //         </button>
//     //     )
//     // },
// ];

//     return (
//         <Checkbox />

//     );


// };

// export default CompletedTaskData;










// import React, { useState, useEffect } from 'react';
// import { Table } from 'antd';
// import axios from "axios";
// import useAuth from '../hooks/useAuth.js';
// import { DOMAIN } from '../Constant.js';

// const CompletedTaskData = () => {
//     const { auth } = useAuth();
//     const [data, setData] = useState([]);
//     const [reviewerList, setReviewerList] = useState([]);
//     const [assignedTo, setAssignedTo] = useState("");
//     const [isSubmitted, setIsSubmitted] = useState({});
//     const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//     const [selectedRow, setSelectedRow] = useState(null);

//     const getCompletedTasks = () => {
//         axios
//             .get(`${DOMAIN}/completedtasks`)
//             .then(response => {
//                 console.log("Response data:", response.data);
//                 setData(response.data)
//             })
//             .catch(error => console.error(error));
//     }

//     const getReviewers = () => {
//         axios
//             .get(`${DOMAIN}/allprofiles`)
//             .then(response => {
//                 const allProfiles = response.data
//                 const reviewerList = allProfiles.length > 0 && allProfiles.filter((item) => item.profile_role === 4)
//                 console.log("reviewer list is", reviewerList);
//                 setReviewerList(reviewerList)
//             })
//             .catch(error => console.error(error));
//     }

//     useEffect(() => {
//         getCompletedTasks();
//         getReviewers();
//         setSelectedRowKeys([]);
//     }, [])
//  for (let i = 0; i < i.le; i++){

//     data.push({
//         taskId: i ,
//         taskTitle: `task1 ${i}`,
//         status: 'completed',
//         creationDate: ` 5/6 ${i}`,
//       });
//  }
//  const onSelectChange = (newSelectedRowKeys) => {
//     console.log('selectedRowKeys changed: ', newSelectedRowKeys);
//     setSelectedRowKeys(newSelectedRowKeys);
//   };
//   const rowSelection = {
//     selectedRowKeys,
//     onChange: onSelectChange,

//   };
//   const hasSelected = selectedRowKeys.length > 0;

//     // const handleAssignToChange = (taskId, e) => {
//     //     setAssignedTo(e.target.value);
//     // };

//     // ajax request after empty completing

//     const handleTaskSubmit = () => {
//         if (selectedRow) {
//             const record = selectedRow;
//             record.reviewer_profile_id = assignedTo;
//             record.profile_role = 4;
//             record.task_role = 4;

//             axios
//                 .put(`${DOMAIN}/updatetask/${record.task_id}`, {
//                     id: record.task_id,
//                     record
//                 })
//                 .then(response => {
//                     let temp = { ...isSubmitted };
//                     temp[response.data._id] = true;
//                     setIsSubmitted(temp);
//                     alert("success");
//                 })
//                 .catch(error => console.error(error));
//         }
//     };

//     const columns = [
//         {
//             title: 'Task ID',
//             dataIndex: 'task_id',
//             key: 'taskId'
//         },
//         {
//             title: 'Task Title',
//             dataIndex: 'task_title',
//             key: 'taskTitle'
//         },
//         {
//             title: 'Status',
//             dataIndex: 'task_status',
//             key: 'status'
//         },
//         {
//             title: 'Created Date',
//             dataIndex: 'createdDate',
//             key: 'creationDate'
//         },
//     ];

//     // const handleCheckboxChange = (selectedRowKeys) => {
//     //     setSelectedRowKeys(selectedRowKeys);
//     //     const selectedRow = data.find(row => row.task_id === selectedRowKeys[0]);
//     //     setSelectedRow(selectedRow);
//     // };

//     return (
//         <div>
//             <div>
//                 <label style={{ marginTop: 20 }}>Assign to a reviewer</label><br />
//                 <select
//                     name="assignedTo"
//                     style={{ width: '150px', height: '35px', border: '1px solid skyblue' }}
//                     value={assignedTo}
//                     onChange={(e) => setAssignedTo(e.target.value)}
//                 >
//                     <option key="0" value="">
//                         Select
//                     </option>
//                     {reviewerList && reviewerList.map((item) => (
//                         <option key={item.profile_id} value={item.projfile_id}>
//                             {item.profile_username}
//                         </option>
//                     ))}
//                 </select>
//             </div>
//             {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''} 
//             <button
//                 style={{ width: '150px', height: '35px', border: '1px solid skyblue', display: "flex", textAlign: "center", float: "right", margin: "0px,10px,0px,5px" }}
//                 onClick={handleTaskSubmit}
//                 disabled={!selectedRow}
//             >
//                 Submit
//             </button>


//             <Table
//                 columns={columns}
//                 dataSource={data}
//                 pagination={{ pageSize: 4 }}
//                 rowSelection={rowSelection}
//             />
//         </div>
//     );
// }

// export default CompletedTaskData;


import React, { useState, useEffect } from 'react';
import { Table, Button, Checkbox } from 'antd';
import axios from "axios";
import useAuth from '../hooks/useAuth.js';
import { DOMAIN } from '../Constant.js';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';

const CompletedTaskData = () => {
  const { auth } = useAuth();
  const [data, setData] = useState([]);
  const [reviewerList, setReviewerList] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [isSubmitted, setIsSubmitted] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const getCompletedTasks = () => {
    axios
      .get(`${DOMAIN}/completedtasks`)
      .then(response => {
        console.log("Response data:", response.data);
        setData(response.data)
      })
      .catch(error => console.error(error));
  }

  const getReviewers = () => {
    axios
      .get(`${DOMAIN}/allprofiles`)
      .then(response => {
        const allProfiles = response.data
        const reviewerList = allProfiles.length > 0 && allProfiles.filter((item) => item.profile_role === 4)
        console.log("reviewer list is", reviewerList);
        setReviewerList(reviewerList)
      })
      .catch(error => console.error(error));
  }

  useEffect(() => {
    getCompletedTasks();
    getReviewers();
    setSelectedRowKeys([]);
  }, [])
  for (let i = 0; i < i.le; i++) {

    data.push({
      taskId: i,
      taskTitle: `task1 ${i}`,
      status: 'completed',
      creationDate: ` 5/6 ${i}`,
    });
  }
  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,

  };
  const hasSelected = selectedRowKeys.length > 0;

  // const handleAssignToChange = (taskId, e) => {
  //     setAssignedTo(e.target.value);
  // };

  // ajax request after empty completing

  // const handleTaskSubmit = () => {
  //     if (selectedRow) {
  //         const record = selectedRow;
  //         record.reviewer_profile_id = assignedTo;
  //         record.profile_role = 4;
  //         record.task_role = 4;

  //         axios
  //             .put(`${DOMAIN}/updatetask/${record.task_id}`, {
  //                 id: record.task_id,
  //                 record
  //             })
  //             .then(response => {
  //                 let temp = { ...isSubmitted };
  //                 temp[response.data._id] = true;
  //                 setIsSubmitted(temp);
  //                 alert("success");
  //             })
  //             .catch(error => console.error(error));
  //     }
  // };


  const handleTaskSubmit = () => {
    selectedRowKeys.forEach(key => {
      const selectedRow = data.find(row => row.task_id === key);
      if (selectedRow) {
        const updatedRow = { ...selectedRow };
        updatedRow.reviewer_profile_id = assignedTo;
        updatedRow.profile_role = 4;
        updatedRow.task_role = 4;
        updatedRow.task_status = "waiting for review";

        axios
          .put(`${DOMAIN}/updatetask/${selectedRow.task_id}`, {
            id: selectedRow.task_id,
            record: updatedRow
          })
          .then(response => {
            let temp = { ...isSubmitted };
            temp[response.data._id] = true;
            setIsSubmitted(temp);
            // alert("success");
            showAlert();
          })
          .catch(error => console.error(error));
      }
    });
  };

  const columns = [
    {
      title: 'Task ID',
      dataIndex: 'task_id',
      key: 'taskId'
    },
    {
      title: 'Task Title',
      dataIndex: 'task_title',
      key: 'taskTitle'
    },
    {
      title: 'Status',
      dataIndex: 'task_status',
      key: 'status'
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'creationDate'
    },
  ];
  const handleAssignToChange = (e) => {
    setAssignedTo(e.target.value);
  };
  const showAlert = () => {
    Swal.fire({
      title: '',
      text: 'Success',
      icon: 'success',
      confirmButtonText: 'OK',
    });
  };
  return (
    <div>
      <div>
        <label style={{ marginTop: 20 }}>Assign to a reviewer</label><br />
        <select
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
      </div>
      {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
      <Button
        type="primary"
        onClick={handleTaskSubmit}
        disabled={!hasSelected || !assignedTo}
        style={{ marginTop: 10 }}
      >
        Submit
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 4 }}
        rowSelection={rowSelection}
        rowKey="task_id"
      />
    </div>
  );
}

export default CompletedTaskData;