// import React, { useState, useEffect } from 'react';
// import TableData from './TableData';
// import Button from '@mui/material/Button';
// import { useNavigate } from 'react-router-dom';
// import useAuth from '../hooks/useAuth.js';
// import axios from "axios";
// import { DOMAIN } from '../Constant';
// import HistoricalRecords from './HistoricalRecords';

// const Manager = () => {
//     const { auth } = useAuth();
//     console.log(auth);
//     const btnSize = '200px'
//     const navigate = useNavigate()
//     const [projectList, setProjectList] = useState([])
//     const handleClick = () => {
//         navigate({
//             pathname: '/createtask',
//             state: { previousRoute: '/manager' }
//         });
//     }
//     const handleCreateProfile = () => {
//         navigate('/createprofilemanager')
//     }
//     const handleProfileDetails = () => {
//         navigate('/profiledetailsmanager')
//     }

//     const [selectedProject, setSelectedProject] = useState(null);

//     const getProject = () => {
//         axios
//             .get(`${DOMAIN}/projectlist`)
//             .then(response => {
//                 console.log("Response data:", response.data);
//                 const allProject = response.data
//                 if (auth.profile_username !== "admin") {
//                     const projectIds = auth.project_id.split(",");
//                     console.log(projectIds)
//                     console.log("projectList:", allProject)
//                     const filteredArray = allProject.filter(item1 => {
//                         console.log("item1", item1);
//                         return projectIds.some(item2 => {
//                             console.log("item2:", item2);
//                             return item1.project_id.toString() === item2
//                         })
//                     })
//                     setProjectList(filteredArray)
//                     console.log("filteredArray:", filteredArray)
//                     // document.getElementById("demo").innerHTML = myArray;
//                     // setProjectList(auth.project_id)
//                     console.log("Project")
//                 }
//                 else { setProjectList(allProject) }
//                 console.log("projectlist  is:", allProject)
//             }).catch(error => console.error(error));
//     }
//     useEffect(() => {
//         getProject();
//     }, []);

//     const handleProjectChange = (event) => {
//         const selectedProjectId = event.target.value;
//         setSelectedProject(selectedProjectId);
//         console.log("selectedProjectId:", selectedProjectId)
//     }
//     return (
//         <div>
//             <h1 style={{ marginBottom: '50px', textAlign: 'center', alignItems: 'center', marginTop: 80 }}>Welcome, {auth.profile_name || ""}</h1>
//             <div>
//                 <label style={{ marginTop: 20 }}>Assigned to Project</label><br />
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
//             <TableData selectedProject={selectedProject} />

//         </div>
//     )
// }
// export default Manager;






// import React, { useState, useEffect } from 'react';
// import TableData from './TableData';
// import Button from '@mui/material/Button';
// import { useNavigate } from 'react-router-dom';
// import useAuth from '../hooks/useAuth.js';
// import axios from 'axios';
// import { DOMAIN } from '../Constant';
// import HistoricalRecords from './HistoricalRecords';

// const Manager = () => {
//   const { auth } = useAuth();
//   console.log(auth);
//   const btnSize = '200px';
//   const navigate = useNavigate();
//   const [projectList, setProjectList] = useState([]);
//   const handleClick = () => {
//     navigate({
//       pathname: '/createtask',
//       state: { previousRoute: '/manager' },
//     });
//   };
//   const handleCreateProfile = () => {
//     navigate('/createprofilemanager');
//   };
//   const handleProfileDetails = () => {
//     navigate('/profiledetailsmanager');
//   };

//   const [selectedProject, setSelectedProject] = useState(null);
//   const [managerName, setManagerName] = useState('');

//   const getProject = () => {
//     axios
//       .get(`${DOMAIN}/projectlist`)
//       .then((response) => {
//         console.log('Response data:', response.data);
//         const allProject = response.data;
//         if (auth.profile_username !== 'admin') {
//           const projectIds = auth.project_id.split(',');
//           console.log(projectIds);
//           console.log('projectList:', allProject);
//           const filteredArray = allProject.filter((item1) => {
//             console.log('item1', item1);
//             return projectIds.some((item2) => {
//               console.log('item2:', item2);
//               return item1.project_id.toString() === item2;
//             });
//           });
//           setProjectList(filteredArray);
//           console.log('filteredArray:', filteredArray);
//           console.log('Project');
//         } else {
//           setProjectList(allProject);
//         }
//         console.log('projectlist is:', allProject);
//       })
//       .catch((error) => console.error(error));
//   };

//   const getManagerName = (projectId) => {
//     axios
//       .get(`${DOMAIN}/managername/${projectId}`)
//       .then((response) => {
//         const manager = response.data.profile_fullname;
//         setManagerName(manager);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   };

//   useEffect(() => {
//     getProject();
//   }, []);

//   const handleProjectChange = (event) => {
//     const selectedProjectId = event.target.value;
//     setSelectedProject(selectedProjectId);
//     getManagerName(selectedProjectId);
//   };

//   return (
//     <div>
//       <h1 style={{ marginBottom: '50px', textAlign: 'center', alignItems: 'center', marginTop: 80 }}>
//         Welcome, {auth.profile_name || ''}
//       </h1>
//       <div>
//         <label style={{ marginTop: 20 }}>Assigned to Project</label>
//         <br />
//         <select
//           name='assignedTo'
//           style={{ width: '150px', height: '35px', border: '1px solid skyblue' }}
//           onChange={handleProjectChange}
//         >
//           <option key='0' value=''>
//             Select
//           </option>
//           {projectList &&
//             projectList.map((item) => (
//               <option key={item.project_id} value={item.project_id}>
//                 {item.project_name}
//               </option>
//             ))}
//         </select>
//       </div>
//       <div>
//         <strong>Manager Name:</strong> {managerName}
//       </div>
//       <TableData selectedProject={selectedProject} />
//     </div>
//   );
// };

// export default Manager;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { DOMAIN } from '../Constant';
// import TableData from './TableData';

// const Manager = () => {
//   const [projectList, setProjectList] = useState([]);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [managerName, setManagerName] = useState('');

//   const getProject = () => {
//     axios
//       .get(`${DOMAIN}/projectlist`)
//       .then((response) => {
//         const allProject = response.data;
//         setProjectList(allProject);
//       })
//       .catch((error) => console.error(error));
//   };

//   const getManagerName = (projectId) => {
//     axios
//       .get(`${DOMAIN}/managername/${projectId}`)
//       .then((response) => {
//         const manager = response.data.managerName;
//         console.log("manager:", response.data.managerName)
//         setManagerName(manager);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   };

//   useEffect(() => {
//     getProject();
//   }, []);

//   const handleProjectChange = (event) => {
//     const selectedProjectId = event.target.value;
//     setSelectedProject(selectedProjectId);
//     if (selectedProjectId) {
//       getManagerName(selectedProjectId);
//     } else {
//       setManagerName('');
//     }
//   };

//   return (
//     <div>
//       <h1 style={{ marginBottom: '50px', textAlign: 'center', alignItems: 'center', marginTop: 80 }}>
//         Welcome, Manager
//       </h1>
//       <div>
//         <label style={{ marginTop: 20 }}>Assigned to Project</label>
//         <br />
//         <select
//           name='assignedTo'
//           style={{ width: '150px', height: '35px', border: '1px solid skyblue' }}
//           onChange={handleProjectChange}
//         >
//           <option key='0' value=''>
//             Select
//           </option>
//           {projectList &&
//             projectList.map((item) => (
//               <option key={item.project_id} value={item.project_id}>
//                 {item.project_name}
//               </option>
//             ))}
//         </select>
//       </div>
//       <div>
//         <strong>Manager Name:</strong> {managerName}
//       </div>
//       {selectedProject && <TableData selectedProject={selectedProject} />}
//     </div>
//   );
// };

// export default Manager;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DOMAIN } from '../Constant';
import TableData from './TableData';
import useAuth from '../hooks/useAuth.js';

const Manager = () => {
    const [projectList, setProjectList] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [managerName, setManagerName] = useState([]);
    const { auth } = useAuth();
    const [data, setData] = useState([])

    const [managerProfiles, setManagerProfiles] = useState([])


    // const getProject = () => {
    //     if (auth.username !== "Admin") {
    //         axios
    //             .get(`${DOMAIN}/projectlist`)
    //             .then((response) => {
    //                 const allProject = response.data;
    //                 setProjectList(allProject);
    //             })
    //             .catch((error) => console.error(error));

    //         axios
    //             .get(`${DOMAIN}/allprofiles`)
    //             .then(response => {
    //                 console.log("Response data:", response.data);
    //                 {/*const managerProfiles = response.data.filter(item => item.profile_role === 2)*/ }

    //                 const managerProfiles = response.data.length > 0 && response.data.filter(item => item.profile_role === 2)
    //                 console.log("managerProfiles:", managerProfiles)
    //                 setData(managerProfiles)
    //             })
    //     }
    //     axios
    //         .get(`${DOMAIN}/projectlist`)
    //         .then((response) => {
    //             const allProject = response.data;
    //             setProjectList(allProject);
    //         })
    //         .catch((error) => console.error(error));
    // };

    // const getProject = () => {
    //     if (auth.profile_role !== 1) {
    //         axios
    //             .get(`${DOMAIN}/projectlist`)
    //             .then((response) => {
    //                 const allProject = response.data;
    //                 // setProjectList(allProject);
    //                 axios
    //                     .get(`${DOMAIN}/allprofiles?profileId=${auth.profileId}`)
    //                     .then((response) => {
    //                         console.log("Response data:", response.data);
    //                         const managerProfiles =
    //                             response.data.length > 0 && response.data.filter((item) => item.profile_role === 2 && item.profile_id === auth.profile_id);
    //                         console.log("managerProfiles:", managerProfiles);
    //                         setManagerProfiles(managerProfiles);
    //                         const managerProjectIds = managerProfiles.flatMap((item) => item.project_id.split(","));
    //                         console.log("managerProjectIds:", managerProjectIds)
    //                         const projectIds = allProject.map((project) => project.project_id);
    //                         // Filter the project list to include only the assigned projects
    //                         const filteredArray = allProject.filter((item1) => {
    //                             return managerProjectIds.some((item2) => {
    //                                 console.log("item1 is:", item1, "item2 is:", item2);
    //                                 return item1.project_id === item2.trim();
    //                             });
    //                         })
    //                         setProjectList(filteredArray);
    //                         console.log("allProject:", allProject)

    //                         console.log("projectList:", projectIds)
    //                         console.log("assignedProjects:", filteredArray)
    //                     }).catch((error) => console.error(error));
    //             }).catch((error) => console.error(error));
    //     } else {
    //         axios
    //             .get(`${DOMAIN}/projectlist`)
    //             .then((response) => {
    //                 const allProject = response.data;
    //                 setProjectList(allProject);
    //             })
    //             .catch((error) => console.error(error));
    //     }
    // };


    const getProject = () => {
        if (auth.profile_role !== 1) {
            axios
                .get(`${DOMAIN}/projectlist`)
                .then((response) => {
                    const allProject = response.data;
                    console.log("All Projects:", allProject);
                    axios
                        .get(`${DOMAIN}/allprofiles?profileId=${auth.profileId}`)
                        .then((response) => {
                            console.log("All Profiles:", response.data);
                            const managerProfiles = response.data.filter((item) => item.profile_role === 2 && item.profile_id === auth.profile_id);
                            console.log("Manager Profiles:", managerProfiles);
                            const managerProjectIds = managerProfiles.flatMap((item) => item.project_id.split(","));
                            console.log("Manager Project IDs:", managerProjectIds);
                            const filteredArray = allProject.filter((item1) =>
                                managerProjectIds.includes(item1.project_id.toString())
                            );

                            console.log("Filtered Projects:", filteredArray);
                            setProjectList(filteredArray);
                        })
                        .catch((error) => console.error(error));
                })
                .catch((error) => console.error(error));
        } else {
            axios
                .get(`${DOMAIN}/projectlist`)
                .then((response) => {
                    const allProject = response.data;
                    console.log("All Projects:", allProject);
                    setProjectList(allProject);
                })
                .catch((error) => console.error(error));
        }
    };


    const getManagerName = (projectId) => {
        axios
            .get(`${DOMAIN}/managername/${projectId}`)
            .then((response) => {
                const manager = response.data.manager_name;
                console.log("manager:", manager);


                setManagerName(manager.join(', '));
            })
            .catch((error) => {
                console.error(error);
                setManagerName("");
            });
    };

    useEffect(() => {
        getProject();
    }, []);

    const handleProjectChange = (event) => {
        const selectedProjectId = event.target.value;
        setSelectedProject(selectedProjectId);
        if (selectedProjectId) {
            getManagerName(selectedProjectId);
        } else {
            setManagerName('');
        }
    };

    return (
        <div>
            <h1 style={{ marginBottom: '50px', textAlign: 'center', alignItems: 'center', marginTop: 80 }}>
                Welcome {auth.profile_fullname}
            </h1>
            <div>
                <label style={{ marginTop: 20 }}>Assigned to Project</label>
                <br />
                <select
                    name='assignedTo'
                    style={{ width: '150px', height: '35px', border: '1px solid skyblue' }}
                    onChange={handleProjectChange}
                >
                    <option key='0' value=''>
                        Select
                    </option>
                    {projectList &&
                        projectList.map((item) => (
                            <option key={item.project_id} value={item.project_id}>
                                {item.project_name}
                            </option>
                        ))}
                </select>
            </div>
            {auth.profile_role !== 2 && (
                <div>
                    <strong>Manager Name:</strong> {managerName}
                </div>)}
            {selectedProject && <TableData selectedProject={selectedProject} />}
        </div>
    );
};

export default Manager;

