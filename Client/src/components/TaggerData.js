import { Button, Table, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth.js';
import axios from "axios";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import { useLocation } from 'react-router-dom';
import 'antd/dist/antd.min.css';
import { DOMAIN } from '../Constant.js';
import { ROLES } from './ROLES.js';


const TaggerData = () => {
  const { Option } = Select;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();
  const taggerId = auth.profile_username === "admin" ? auth.profile_username : auth.profile_id;
  const [data, setData] = useState([]);
  const [url, setUrl] = useState("");
  const [mismatchedTasks, setMismatchedTasks] = useState([]);
  const [portNumber, setPortNumber] = useState();
  let currentPort;
  let location = useLocation();
  let currentURL = window.location.href;
  let porturl = new URL(currentURL);
  let appPort = porturl.port;
  const columnsRow = [
    
    {
      title: 'Task Title',
      dataIndex: 'task_title',
      key: 'key',
      render: (text, record) => {
        const taskTitles = record.task_title.split(',');

        return (
          <div style={{ marginBottom: '8px', display: 'flex', flexWrap: 'wrap' }}>
            {taskTitles.map((titlePart, titleIndex) => (
              <div key={titleIndex} style={{ marginRight: '8px' }}>
                {titlePart}
              </div>
            ))}
          </div>
        );
      },
    },

    {
      title: 'Assign To',
      dataIndex: 'profile_username',
      key: 'key',
      render: (text, record, pname) => (
        <AssignTo pname={pname} record={record} mismatchedTasks={mismatchedTasks} />
      )
    },
    {
      title: 'No Of Items',
      dataIndex: 'task_filename',
      key: 'key',
      render: (text, record) => {
        try {
          let numImages = 0;

          if (auth.profile_role === 3 ||auth.profile_role === 1 ||auth.profile_role === 2) {
            numImages = record.task_filename || 0; }

          const otherAppUrl = `http://localhost:${portNumber}/${record.profile_id}/${record.task_mediatype}?roleid=${auth.profile_role}&username=${taggerId}`;
          return (
            <a href={otherAppUrl} target="_blank">
              {numImages}
            </a>
          );
        } catch (error) {
          console.error("Error rendering number of images:", error);
          return 0; // or display an error message
        }
      },
    },

    {
      title: 'Status',
      dataIndex: 'task_status',
      key: 'key',
      render: (text, record) => (
        <StatusSelect record={record} />
      )
    },

    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'key'
    },
  ];




  //   const AssignTo = ({ pname }) => {
  //     const defaultFormData = {
  //       taskTitle: '',
  //       taskId: '',
  //       status: 'To do',
  //       assignedProject: '',
  //       assignedTo: '',
  //       reviewer_profile_id: '',
  //       role: 3,
  //       creationDate: '',
  //       mediaType: '',
  //       fileName: '',
  //       filePath: ''
  //     }
  //     let [formData, setFormData] = useState(defaultFormData);
  //     let [taggers, setTaggers] = useState([]);

  //     let handleChange = (e) => {
  //       const { name, value } = e.target;
  //       setFormData((prevData) => ({
  //         ...formData,
  //         [name]: value,
  //       }));
  //     };
  //     let getTaggers = () => {
  //       axios
  //         .get(`${DOMAIN}/getalltaggers`)
  //         .then(res => {
  //           const allProfiles = res.data;
  //           setTaggers(allProfiles);
  //       }).catch(error => console.error(error));
  //     }

  //     useEffect(() => {
  //         getTaggers();
  //     }, []);

  //   return (
  //     <select name="assignedTo" id="assignedTo" value={formData.assignedTo} onChange={handleChange} style={{ width: '150px' ,height:'30px'}}>
  //                       {/* <option key={0} value={0}>
  //                           Select
  //                       </option> */}
  //                       { (taggers.length > 0 && taggers.map((tagger) => (
  //                         <option key={tagger.profile_id} value={tagger.profile_id}>
  //                             {tagger.profile_username}
  //                         </option>
  //                     )))}</select>
  //   );
  // };

  const StatusSelect = ({ record }) => {
    const [taskStatus, setTaskStatus] = useState({});
    const [data, setData] = useState([]);

    useEffect(() => {
      setTaskStatus((prevState) => ({
        ...prevState,
        [record.task_id]: record.task_status || "Todo"
      }));
    }, [record]);

    const [completedTaskIds, setCompletedTaskIds] = useState([]);

    const handleStatusChange = (value) => {
      record.task_status = value;
      const updatedTaskStatus = { ...taskStatus, [record.task_id]: value };
      setTaskStatus(updatedTaskStatus);
      if (value === "Completed") {
        setCompletedTaskIds([...completedTaskIds, record.task_id]);
      }
      const showAlert = () => {
        Swal.fire({
          title: '',
          text: 'Status changed succesfullly',
          icon: 'Record added successfully',
          confirmButtonText: 'OK',
        });
      };
      // Update the task status in the backend
      axios
        .put(`${DOMAIN}/updatetask/${record.task_id}`, {
          record: { ...record, task_status: "Completed", reviewer_task_status: "Waiting for review" },
        })
        .then((response) => {
          console.log("Response data:", response.data);
          showAlert(response.data.message);

          // Remove the completed task from the tagger list
          const updatedData = data.filter((task) => task.task_id !== record.task_id);
          setData(updatedData);
        })
        .catch((error) => console.error(error));
    };

    axios.post(`${DOMAIN}/storePort`, { port: appPort })
      .then((response) => {
        // Handle the response if needed
        console.log("Port stored in the backend:", response.data);
      })
      .catch((error) => {
        console.error("Error storing port in the backend:", error);
      })

    return (
      <Select
        value={taskStatus[record.task_id]}
        style={{ width: 120 }}
        onChange={handleStatusChange}
      >
        <Option value="Reassigned" disabled>
          reassigned
        </Option>
        <Option value="Completed">Completed</Option>
        <Option value="Done" disabled>
          Task done
        </Option>
      </Select>
    );
  };

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

  const getTaggers = () => {
    axios
      .get(`${DOMAIN}/getalltaggers`)
      .then((response) => {
        const allProfiles = response.data;
        getTask(taggerId, allProfiles);
      })
      .catch((error) => console.error(error));
  };

  const getTask = (taggerIdInfo, taggers) => {
    if (taggerId === "admin") {
      axios
        .get(`${DOMAIN}/getalltask`)
        .then((response) => {
          const allTasks = response.data;
          const filteredArray = allTasks.filter((item1) => {
            return taggers.some((item2) => {
              return item1.profile_id === item2.profile_id && item1.task_status !== "Completed" && item1.task_status !== "Pass" && item1.task_status !== "waiting for review";
            })
          })
        })
    }

    

    if (taggerId === "admin" || auth.profile_role === 2 ) {
      
      const mergeTasks = (tasks) => {
        const mergedTasks = [];
        const taskMap = new Map();

        tasks.forEach((taskGroup) => {
          taskGroup.forEach((task) => {
            const key = `${task.profile_id}-${task.project_id}-${task.task_mediatype}`;

            if (!taskMap.has(key)) {
              taskMap.set(key, []);
            }

            taskMap.get(key).push(task);
          });
        });

        taskMap.forEach((groupedTasks) => {
          const mergedTask = { ...groupedTasks[0] }; // Use the first task as a base
          console.log('  mergedTask1:', mergedTask);

          mergedTask.task_id = groupedTasks.map((t) => t.task_id).join(','); // Combine task_ids

          // mergedTask.task_title = groupedTasks.map((t) => t.task_title).join(','); // Combine task_titles
          mergedTask.task_title = groupedTasks.map((t) => {
            console.log('Value of t:', t);
            console.log('Value of t.task_title:', t.task_title);

            return t.task_title;
          }).join(',');
          // Combine task_titles

          mergedTask.task_filename = groupedTasks.length; // Count of similar tasks

          // You can add similar logic for other properties if needed

          mergedTasks.push(mergedTask);
          console.log('Value of mergedTask:', mergedTask);
        });
        console.log('Value of mergedTasks:', mergedTasks);
        return mergedTasks;
      };


      const fetchData = async () => {
        try {
          // First API call: /getalltask
          const allTaskPromise = axios.get(`${DOMAIN}/getalltask`);

          // Second API call: /getmismatchedidtask
          const mismatchedPromise = axios.get(`${DOMAIN}/getmismatchedidtask`);

          // Wait for both promises to resolve
          const [allTaskResponse, mismatchedResponse] = await Promise.all([allTaskPromise, mismatchedPromise]);

          const allTasks = allTaskResponse.data;
          const mismatchedTasks = mismatchedResponse.data;

          console.log("All Tasks:", allTasks);
          console.log("Mismatched Tasks:", mismatchedTasks);

          // Filter tasks based on conditions
          const filteredArray = allTasks.filter((item) => {
            const isAssignedToTagger = taggers.some((tagger) => tagger.profile_id === item.profile_id);
            const isTaskInProgress = item.task_status !== "Completed" && item.task_status !== "Pass" && item.task_status !== "waiting for review";

            return isAssignedToTagger && isTaskInProgress;
          });

          console.log("Filtered Array:", filteredArray);

          // Concatenate mismatched tasks to the filtered array
          const combinedTasks = [...filteredArray, ...mismatchedTasks];
          const mergedTasks = mergeTasks([combinedTasks]);

          console.log("mergedTasks:", mergedTasks);

          console.log("Combined Tasks:", combinedTasks);

          setData(mergedTasks);
          console.log("json:", (JSON.parse((combinedTasks[0].task_filedata))).length);
          console.log("tasklist is:", combinedTasks);
          console.log("mergedTasks:",mergedTasks)
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }
    
    else {
      axios
        .post(`${DOMAIN}/taskbyfilter`, {
          assignedTo: taggerIdInfo,
        })
        .then((response) => {
          const mergeTasks = (tasks) => {
            const mergedTasks = [];
            const taskMap = new Map();
    
            tasks.forEach((taskGroup) => {
              taskGroup.forEach((task) => {
                const key = `${task.profile_id}-${task.project_id}-${task.task_mediatype}`;
    
                if (!taskMap.has(key)) {
                  taskMap.set(key, []);
                }
    
                taskMap.get(key).push(task);
              });
            });
    
            taskMap.forEach((groupedTasks) => {
              const mergedTask = { ...groupedTasks[0] }; // Use the first task as a base
              console.log('mergedTask1:', mergedTask);
    
              mergedTask.task_id = groupedTasks.map((t) => t.task_id).join(','); // Combine task_ids
              mergedTask.task_title = groupedTasks.map((t) => t.task_title).join(','); // Combine task_titles
              mergedTask.task_filename = groupedTasks.length; // Count of similar tasks
    
              // You can add similar logic for other properties if needed
    
              mergedTasks.push(mergedTask);
              console.log('mergedTask:', mergedTask);
            });
            console.log('mergedTasks:', mergedTasks);
            return mergedTasks;
          };
    
          console.log("Response data is:", response.data);
          const allTasks = response.data;
          const filteredArray = allTasks.filter((item1) => {
            return item1.profile_id === taggerIdInfo && item1.task_status !== "Completed" && item1.task_status !== "Pass" && item1.task_status !== "waiting for review";
          });
          const mergedTasks = mergeTasks([filteredArray]);
          setData(mergedTasks);
          console.log("mergedTasks:", mergedTasks);
        })
        .catch((error) => console.error(error));
    }
  };

  const showCustomeAlert = (error) => {
    Swal.fire({
      title: '',
      text: error,
      icon: 'Record added successfully...',
      confirmButtonText: 'OK',
    });
  };
  useEffect(() => {
    getTaggers();

    axios.get(`${DOMAIN}/getPort?appName=tagging-toolV2`)
      .then(result => {
        setPortNumber(result['data'].appPort);
      }).catch(error => {
        showCustomeAlert(error)
      })
  }, []);

  console.log("Data in TaggerData component:", data);

  const AssignTo = ({ pname, record, mismatchedTasks }) => {
    const defaultFormData = {
      taskTitle: '',
      taskId: '',
      status: 'To do',
      assignedProject: '',
      assignedTo: '',
      reviewer_profile_id: '',
      role: 3,
      creationDate: '',
      mediaType: '',
      fileName: '',
      filePath: ''
    }
    const [formData, setFormData] = useState(defaultFormData);
    const [taggers, setTaggers] = useState([]);

    // const handleChange = (e) => {
    //   const { name, value } = e.target;
    //   setFormData((prevData) => ({
    //     ...formData,
    //     [name]: value,
    //   }));
    // };

    // const handleChange = (e) => {
    //   const { name, value } = e.target;
    //   setFormData((prevData) => ({
    //     ...prevData,
    //     [name]: value,
    //   }));
    // };

    // const handleChange = (e) => {
    //   const { value } = e.target;
    //   setFormData({
    //     assignedTo: value,
    //   });
    // };

    const handleChange = (e) => {
      const { value } = e.target;
      setFormData({
        assignedTo: value,
      });

      // Call the backend API to update the assignment
      axios
        .post(`${DOMAIN}/updateAssignment/${record.task_id}`, {
          record, assignedTo: value,
        })
        .then((response) => {
          console.log("Assignment updated successfully:", response.data);
        })
        .catch((error) => console.error("Error updating assignment:", error));
    };

    const getTaggers = () => {
      axios
        .get(`${DOMAIN}/getalltaggers`)
        .then(res => {
          const allProfiles = res.data;
          setTaggers(allProfiles);
        }).catch(error => console.error(error));
    }
    useEffect(() => {
      getTaggers();
    }, []);
    const findTaggerById = (profileId) => {
      return taggers.find(tagger => tagger.profile_id === profileId);
    };
    // return (
    //   <select name="assignedTo" id="assignedTo" value={formData.assignedTo} onChange={handleChange} style={{ width: '150px', height: '30px' }}>
    //     {/* <option key={0} value={0}>
    //                       Select
    //                   </option> */}
    //     {(taggers.length > 0 && taggers.map((tagger) => (
    //       <option key={tagger.profile_id} value={tagger.profile_id}>
    //         {tagger.profile_username}
    //       </option>
    //     )))}</select>
    // );

    const tasksPerLine = 3;
    const [tasks, setTasks] = useState([]);
    const isIndividualLogin = auth.profile_role !== 1 && auth.profile_role !== 2;
    return (
      <select
        name="assignedTo"
        id="assignedTo"
        value={formData.assignedTo || findTaggerById(record.profile_id)?.profile_id || ''}
        onChange={handleChange}
        style={{ width: '150px', height: '30px' }}
        disabled={isIndividualLogin} 
      >
        <option value="">Select</option>
        {taggers.length > 0 &&
          taggers.map((tagger) => (
            <option
              key={tagger.profile_id}
              value={tagger.profile_id}
            >
              {tagger.profile_username}
            </option>
          ))}
      </select>
    )

  }

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
      <Table
        rowSelection={rowSelection}
        columns={columnsRow}
        dataSource={data}
        pagination={{ pageSize: 4 }}
      />
    </div>
  );
};

export default TaggerData;