// import { Button, Table, Select, Input, Modal, Form } from 'antd';
// import React, { useState } from 'react';
// import 'antd/dist/antd.min.css'
// //import useAuth from '../hooks/useAuth.js';
// import axios from "axios";
// import { useEffect } from 'react';
// import { DOMAIN } from '../Constant';


// // let columns = [
// //     {
// //         title: "Manager's Full Name",
// //         dataIndex: 'profile_fullname',
// //         key: 'key'
// //     },
// //     {
// //         title: 'Username',
// //         dataIndex: 'profile_username',
// //         key: 'key'
// //     },
// //     {
// //         title: 'Assigned Projects',
// //         dataIndex: 'project_name',
// //         key: 'key',
// //     }
// // ]

// const ProfileData = () => {
//     const [data, setData] = useState([])
//     const [projectList, setProjectList] = useState([])
//     const [selectedProject, setSelectedProject] = useState(null);


//     // const [rowData, setRowData] = useState([]);
//     // const [visible, setVisible] = useState(false);

//     // const [form] = Form.useForm();

//     // const showModal = (key) => {
//     //     setVisible(prevState => ({
//     //         ...prevState,
//     //         [key]: true
//     //     }));
//     // };
//     // const handleCancel = (key) => {
//     //     setVisible(prevState => ({
//     //         ...prevState,
//     //         [key]: false
//     //     }));
//     // };

//     // const handleOk = () => {
//     //     form.validateFields().then(values => {
//     //         // Handle form submission here
//     //         console.log('Form values:', values);

//     //         // Close the modal
//     //         handleCancel();
//     //     });
//     // };

//     // // Function to handle the "Edit" button click
//     // const handleEdit = key => {
//     //     const updatedData = rowData.map(row => {
//     //         console.log("row:", row)
//     //         if (row.key === key) {
//     //             return { ...row, editable: !row.editable };
//     //         }
//     //         return row;
//     //     });

//     //     setRowData(updatedData);
//     //     showModal();
//     // };

//     // // Function to handle the "Delete" button click
//     // const handleDelete = key => {
//     //     const updatedData = rowData.filter(row => row.key !== key);
//     //     setRowData(updatedData);
//     // };
//     const getAllProfiles = () => {
//         axios
//             .get(`${DOMAIN}/allprofiles`)
//             .then(response => {
//                 console.log("Response data:", response.data);
//                 {/*const managerProfiles = response.data.filter(item => item.profile_role === 2)*/ }

//                 const managerProfiles = response.data.length > 0 && response.data.filter(item => item.profile_role === 2)
//                 console.log("managerProfiles:", managerProfiles)
//                 setData(managerProfiles)

//                 axios
//                     .get(`${DOMAIN}/allprojects`)
//                     .then(response => {
//                         console.log("Response data projects:", response.data);
//                         const allprojects = response.data
//                         const result = managerProfiles.map(eachProfile => {
//                             const filteredArray = allprojects.filter(item1 => {
//                                 console.log("item1", item1);
//                                 return eachProfile.project_id.split(",").some(item2 => {
//                                     console.log("item2:", item2);
//                                     return item1.project_id.toString() === item2
//                                 })
//                             }).map(item => item.project_Name);
//                             eachProfile.project_name = filteredArray.toString()
//                             return eachProfile
//                         })
//                         console.log("result is:", result)
//                         setData(result)
//                         console.log("setData:", data)
//                     })
//                     .catch(error => console.error(error));
//             })
//             .catch(error => console.error(error));
//     }

//     const handleProjectChange = (event) => {
//         const selectedProjectId = event.target.value;
//         setSelectedProject(selectedProjectId);
//         console.log("selectedProjectId:", selectedProjectId)
//     }
//     // Update data with editable flag
//     useEffect(() => {
//         getAllProfiles();
//         // const updatedData = data.map(row => ({
//         //     ...row,
//         //     editable: false
//         // }));
//         // setRowData(updatedData);
//     }, []);


//     let columns = [
//         {
//             title: "Manager's Full Name",
//             dataIndex: 'profile_fullname',
//             key: 'key',
//         },
//         {
//             title: 'Username',
//             dataIndex: 'profile_username',
//             key: 'key'
//         },
//         {
//             title: 'Assigned Projects',
//             dataIndex: 'project_name',
//             key: 'key',
//         },
//         // {
//         //     title: 'Action',
//         //     key: 'action',
//         //     render: (text, record) => (
//         //         <span>
//         //             <Button style={{ width: '30%' }} onClick={() => handleEdit(record.key)}>
//         //                 {record.editable ? 'Save' : 'Edit'}
//         //             </Button>
//         //             <Button style={{ width: '30%' }} onClick={() => handleDelete(record.key)}>Delete</Button>
//         //         </span>
//         //     ),
//         // },
//     ]

//     return (
//         <div>
//             <div>
//                 <label style={{ marginTop: 20 }}>Select a Manager name</label><br />
//                 <select name="assignedTo" style={{ width: '150px', height: '35px', border: '1px solid skyblue' }} onChange={handleProjectChange}>
//                     <option key="0" value="">
//                         Select
//                     </option>
//                     {projectList && projectList.map((item) => (

//                         <option key={item.project_id} value={item.project_id}>
//                             {item.project_name}
//                         </option>
//                     ))}</select>
//                 {/* <Button variant="outlined" style={{ width: btnSize, margin: '8px' }} onClick={handleCreateProfile}>Create Profile</Button>
//                 <Button variant="outlined" style={{ width: btnSize, margin: '8px' }} onClick={handleProfileDetails}>Profile Details</Button> */}
//                 {/*<Button variant="contained" component="label" style={{ width: btnSize, margin: '8px' }}>Upload Image
//                     <input hidden accept="image/*" multiple type="file" />
//                 </Button>
//                 <Button variant="contained" component="label" style={{ width: btnSize, margin: '8px' }}>Upload Document
//                     <input hidden accept="image/*" multiple type="file" />
//                 </Button>
//                 <Button variant="contained" component="label" style={{ width: btnSize, margin: '8px' }}>Upload PDF
//                     <input hidden accept="image/*" multiple type="file" />
//                 </Button>*/}
//             </div>
//             <Table columns={columns} dataSource={data} pagination={{ pageSize: 4 }} />
//         </div>
//     );
// }
// export default ProfileData;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, Table } from 'antd';
import 'antd/dist/antd.min.css';
import { DOMAIN } from '../Constant';
import ProfileDataManager from './ProfileDataManager';

const { Option } = Select;

  const ProfileData = () => {
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedManagerDetails, setSelectedManagerDetails] = useState(null);

  useEffect(() => {
    axios
      .get(`${DOMAIN}/allprofiles`)
      .then(response => {
        const managerProfiles = response.data.filter(item => item.profile_role === 2);
        setManagers(managerProfiles);
      })
      .catch(error => console.error(error));
  }, []);

  const handleManagerChange = (value) => {
    const manager = managers.find(manager => manager.profile_fullname === value);
    setSelectedManager(manager);
  };

//   useEffect(() => {
//     if (selectedManager) {
//       axios
//         .get(`${DOMAIN}/allprojects`)
//         .then(response => {
//           const allProjects = response.data;
//           const assignedProjectIds = selectedManager.project_id.split(', ');
//           const assignedProjects = assignedProjectIds.map(projectId => {
//             // console.log("assigned projects:",assignedProjects)
//             const project = allProjects.find(project => project.project_id.toString() === projectId);
//             return project ? project.project_name : '';

            
//           });
//             console.log("assigned projects:",assignedProjects)

//           setSelectedManagerDetails({ ...selectedManager, assignedProjects });
//         })
//         .catch(error => console.error(error));
//     } else {
//       setSelectedManagerDetails(null);
//     }
//   }, [selectedManager]);

// useEffect(() => {
//     if (selectedManager) {
//       axios
//         .get(`${DOMAIN}/allprojects`)
//         .then(response => {
//           const allProjects = response.data;
//           const assignedProjectNames = (selectedManager.project_name || '').split(', ');
//           const assignedProjects = assignedProjectNames.map(projectName => {
//             const project = allProjects.find(project => project.project_name === projectName);
//             return project ? project.project_name : projectName;
//           });
//           console.log("assigned projects:", assignedProjects);
//           setSelectedManagerDetails({ ...selectedManager, assignedProjects });
//         })
//         .catch(error => console.error(error));
//     } else {
//       setSelectedManagerDetails(null);
//     }
//   }, [selectedManager]);
useEffect(() => {
  if (selectedManager) {
    axios
      .get(`${DOMAIN}/allprojects`)
      .then(response => {
        const allProjects = response.data;
        console.log(response.data)
        const assignedProjectIds = (selectedManager.project_id || '').split(',').map(projectId => projectId.trim());
        console.log("projectids:", assignedProjectIds)
        const assignedProjects = assignedProjectIds.map(projectId => {
            const project = allProjects.find(project => project.project_id.toString() === projectId);

          return project ? project.project_Name : '';
        });
        console.log("Assigned Projects:", assignedProjects);
        setSelectedManagerDetails({ ...selectedManager, assignedProjects });
      })
      .catch(error => {
        console.error(error);
        setSelectedManagerDetails({ ...selectedManager, assignedProjects: [] });
      });
  } else {
    setSelectedManagerDetails(null);
  }
}, [selectedManager]);

  const columns = [
    {
      title: "Manager's Full Name",
      dataIndex: 'profile_fullname',
      key: 'profile_fullname',
    },
    {
      title: 'Username',
      dataIndex: 'profile_username',
      key: 'profile_username',
    },
    {
      title: 'Assigned Projects',
      dataIndex: 'assignedProjects',
      key: 'assignedProjects',
      render: (assignedProjects) => (
        <span>{assignedProjects.join(',')}</span>
      ),
    },
  ];

  return (
    <div>
      <Select
        placeholder="Select a Manager"
        onChange={handleManagerChange}
        style={{ width: 200, marginBottom: 16 }}
      >
        {managers.map(manager => (
          <Option key={manager.profile_username} value={manager.profile_fullname}>
            {manager.profile_fullname}
          </Option>
        ))}
      </Select>
      <Table
        columns={columns}
        dataSource={selectedManagerDetails ? [selectedManagerDetails] : []}
        pagination={false}
      />
    </div>
  );
};

export default ProfileData;
