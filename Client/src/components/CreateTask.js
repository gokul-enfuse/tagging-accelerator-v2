// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import axios from "axios";
// import { useEffect } from 'react';
// import { DOMAIN } from '../Constant';
// import Swal from 'sweetalert2';
// import 'sweetalert2/dist/sweetalert2.css';

// const CreateTask = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const previousRoute = location.state?.previousRoute;
//     const defaultFormData = {
//         taskTitle: '',
//         taskId: '',
//         status: 'To do',
//         assignedProject: '',
//         assignedTo: '',
//         reviewer_profile_id: '',
//         role: 3,
//         creationDate: '',
//         mediaType: '',
//         fileName: '',
//         filePath: ''
//     }
//     // console.log("locaton state is:", location.state)
//     const [formData, setFormData] = useState(defaultFormData);
//     const [taggers, setTaggers] = useState([]);
//     const [projects, setProjects] = useState([]);
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [isFormValid, setIsFormValid] = useState(false);

//     const handleFileChange = async (event) => {
//         const selectedFile = event.target.files[0];
//         if (selectedFile) {
//             const formData = new FormData();
//             formData.append('image', selectedFile);
//             try {
//                 console.log('Sending data to server:', formData);
//                 const response = await axios.post('http://localhost:3030/api/upload', formData);
//                 console.log('Server response:', response.data);
//                 if (response.status === 200) {
//                     console.log('File uploaded successfully');
//                     console.log('File path:', "http://localhost:3030/" + response.data.filePath.replace(/\\/g, '/'));
//                     console.log('File name:', response.data.fileName);
//                     const updatedFileData = [
//                         {
//                             filename: response.data.fileName,
//                             filepath: response.data.filePath.replace(/\\/g, '/'),
//                         },
//                     ];
//                     console.log("formdata file:", formData)
//                     setFormData({
//                         ...formData,
//                         filename: response.data.fileName,
//                         filepath: "http://localhost:3030/" + response.data.filePath.replace(/\\/g, '/')
//                     });
//                     console.log("Updated fileData:", updatedFileData);

//                     validateForm();

//                 } else {
//                     console.error('File upload failed');
//                 }
//             } catch (error) {
//                 console.error('File upload error:', error);
//             }
//         }

//     };
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevData) => ({
//             ...formData,
//             [name]: value,
//         }));
//         validateForm();
//     };
//     console.log("formdata:", formData); // This will correctly log the updated formData
//     const validateForm = () => {
//         if (formData.taskTitle &&
//             formData.assignedProject &&
//             formData.assignedTo &&
//             formData.creationDate &&
//             formData.mediaType &&
//             formData.filename &&
//             formData.filepath) {            
//             setIsFormValid(true);
//         }
//     };
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         // Call validateForm here to check the form's validity only when it's submitted
//         validateForm();
//         if (isFormValid) {
//             // Display an error message or alert
//             alert("Please fill in all required fields.");
//             return;
//         }

//         console.log("handlesubmit formdata:", formData)
//         const formDataToSend = {
//             ...formData,
//             status: 'To Do',
//             fileName: formData.filename,
//             filePath: FormData.filepath
//         };
//         console.log("formDataToSend:", formDataToSend)
//         let response = await fetch(`${DOMAIN}/createtask`, {
//             method: 'POST',
//             body: JSON.stringify(formDataToSend),
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         })
//         const data = await response.json();
//         setFormData(defaultFormData)
//         if (data.status === 200) {
//         }
//         // navigate(previousRoute || '/');
//         if (data.status === 200) {
//             // alert('Record added successfully');
//         }
//         //navigate(previousRoute || '/');
//         // document.getElementById("create-task").reset();
//         showAlert();
//     }
//     const getTaggers = () => {
//         axios
//             .get(`${DOMAIN}/getalltaggers`)
//             .then(res => {
//                 const allProfiles = res.data;
//                 setTaggers(allProfiles);
//             }).catch(error => console.error(error));
//     }
//     const changeSelectOptionHandler = (event) => {
//         console.log("Vikas=", event.target.value);
//         getProject(event.target.value);
//     };

//     const getProject = () => {
//         axios
//             .get(`${DOMAIN}/specificprojects`)
//             .then(res => {
//                 const allProjects = res.data;
//                 setProjects(allProjects);
//             }).catch(error => console.error(error));
//     }
//     useEffect(() => {
//         getTaggers();
//         getProject();
//     }, []);

//     const showAlert = () => {
//         Swal.fire({
//             title: '',
//             text: 'Task added successfully',
//             icon: 'success',
//             confirmButtonText: 'OK',
//         });
//     };
//     return (
//         <form onSubmit={handleSubmit} id='create-task'>
//             <fieldset style={{ border: '1px solid #000', padding: '20px', width: '800px' }}>
//                 <legend>Create Task:</legend>
//                 <div style={{ flex: 1 }}>
//                     {/* Add a file input */}
//                     <label>Upload File</label><br />
//                     <input
//                         type="file"
//                         name="fileData"
//                         accept=".jpg, .jpeg, .png, .gif, .mp3, .pdf, .doc, .docx"
//                         onChange={handleFileChange}
//                         id="fileData"
//                     /><br />
//                 </div>
//                 <label>Assigned To</label><br />
//                 <select name="assignedTo" id="assignedTo" value={formData.assignedTo} onChange={handleChange} style={{ width: '230px' }}>
//                     <option key={0} value={0}>
//                         select
//                     </option>
//                     {taggers.length > 0 && taggers.map((tagger) => (
//                         <option key={tagger.profile_id} value={tagger.profile_id}>
//                             {tagger.profile_username}
//                         </option>
//                     ))}</select><br />
//                 <label>Assigned Project</label><br />
//                 <select name="assignedProject" id="assignedProject" value={formData.assignedProject} onChange={handleChange} style={{ width: '230px' }}>
//                     <option key={0} value={0}>
//                         select
//                     </option>
//                     {projects.length > 0 && projects.map((project) => (
//                         <option key={project.project_id} value={project.project_id}>
//                             {project.project_Name}
//                         </option>
//                     ))}</select><br />
//                 <label>Task Title</label><br />
//                 <input type="text" name="taskTitle" value={formData.taskTitle} onChange={handleChange}></input><br />
//                 {/* <label>Task ID</label><br />
//                 <input type="text" name="taskId" value={formData.taskId} onChange={handleChange}></input><br />*/}
//                 <label>Creaton Date</label><br />
//                 <input type="date" name="creationDate" value={formData.creationDate} onChange={handleChange}></input><br />
//                 <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
//                 </div>
//                 <label>Media Type</label><br />
//                 <select name="mediaType" id='mediaType' value={formData.mediaType} onChange={handleChange}>
//                     <option value="null">Select value</option>
//                     <option value="image">Image</option>
//                     <option value="audio">Audio</option>
//                     <option value="video">Video</option>
//                     <option value="document">Document</option>
//                 </select><br />
//             </fieldset>

//             <button type="submit" style={{ width: '800px', marginLeft: '0px' }}>Add Task</button>
//         </form>
//     );
// };
// export default CreateTask;
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { DOMAIN, DOMAINCLIENT } from '../Constant';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';

const CreateTask = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const previousRoute = location.state?.previousRoute;
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
        filePath: '',
        status: 'To Do', // Include the status field
    };

    const [formData, setFormData] = useState(defaultFormData);
    const [taggers, setTaggers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    // const handleFileChange = async (event) => {
    //     const selectedFile = event.target.files[0];


    //     if (selectedFile) {
    //         setSelectedFile(selectedFile);
    //     }
    // };


    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        console.log("vikas=", selectedFile, DOMAIN)
        if (selectedFile) {
            const formData = new FormData();
            formData.append('image', selectedFile);
            try {
                console.log('Sending data to server:', formData);
                const response = await axios.post(`${DOMAIN}/api/upload`, formData);
                console.log('Server response:', response.data);
                if (response.status === 200) {
                    console.log('File uploaded successfully');
                    console.log('File path:', `${DOMAINCLIENT}` + response.data.filePath.replace(/\\/g, '/'));
                    console.log('File name:', response.data.fileName);
                    const updatedFileData = [
                        {
                            filename: response.data.fileName,
                            filepath: response.data.filePath.replace(/\\/g, '/'),
                        },
                    ];
                    console.log("formdata file:", formData)
                    setFormData({
                        ...formData,
                        filename: response.data.fileName,
                        //filepath: `${DOMAINCLIENT}` + response.data.filePath.replace(/\\/g, '/')
                        filepath: `${DOMAINCLIENT}uploads/images/` + response.data.fileName
                    });
                    console.log("Updated fileData:", updatedFileData);

                    // validateForm();

                } else {
                    console.error('File upload failed');
                }
            } catch (error) {
                console.error('File upload error:', error);
            }
        }

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = {
            ...formData,
            status: 'To Do',
            fileName: formData.fileName, // Include fileName in the form data
            filePath: formData.filePath, // Include filePath in the form data
        };

        try {
            const response = await axios.post(`${DOMAIN}/createtask`, formDataToSend, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                // Task created successfully, you can navigate or show a success message here
                showAlert();
                setFormData(defaultFormData); // Reset the form
            } else {
                console.error('Task creation failed');
            }
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const isFormValid = () => {
        return (
            formData.taskTitle &&
            formData.assignedProject &&
            formData.assignedTo &&
            formData.creationDate &&
            formData.mediaType &&
            selectedFile
        );
    };

    const showAlert = () => {
        Swal.fire({
            title: '',
            text: 'Task added successfully',
            icon: 'success',
            confirmButtonText: 'OK',
        });
    };

    const getTaggers = () => {
        axios
            .get(`${DOMAIN}/getalltaggers`)
            .then((res) => {
                const allProfiles = res.data;
                setTaggers(allProfiles);
            })
            .catch((error) => console.error(error));
    };

    const getProjects = () => {
        axios
            .get(`${DOMAIN}/specificprojects`)
            .then((res) => {
                const allProjects = res.data;
                setProjects(allProjects);
            })
            .catch((error) => console.error(error));
    };

    useEffect(() => {
        getTaggers();
        getProjects();
    }, []);

    return (
        <form className='createtask_container' onSubmit={handleSubmit} id='create-task'>
              <fieldset style={{ border: '1px solid #000', padding: '20px'}}>  
                <div className='createtask_content'>
                <h1>Create Task:</h1>
                <div style={{ flex: 1 }}>
                    {/* Add a file input */}
                    <label>Upload File</label><br />
                    <input
                        type="file"
                        name="fileData"
                        accept=".jpg, .jpeg, .png, .gif, .mp3, .pdf, .doc, .docx"
                        onChange={handleFileChange}
                        id="fileData"
                        required
                    />
                    <br />
                </div>
                <label>Assigned To</label><br />
                <select className="create-task-select" name="assignedTo" id="assignedTo" value={formData.assignedTo} onChange={handleChange} style={{ width: '230px' }} required >
                    <option  selected disabled key={0} value="">
                        select
                    </option>
                    {taggers.length > 0 && taggers.map((tagger) => (
                        <option key={tagger.profile_id} value={tagger.profile_id}>
                            {tagger.profile_username}
                        </option>
                    ))}</select><br />
                <label>Assigned Project</label><br />
                <select className="create-task-select" name="assignedProject" id="assignedProject" value={formData.assignedProject} onChange={handleChange} style={{ width: '230px' }} required >
                    <option key={0} value="">
                        select
                    </option>
                    {projects.length > 0 && projects.map((project) => (
                        <option key={project.project_id} value={project.project_id}>
                            {project.project_Name}
                        </option>
                    ))}</select><br />
                <label>Category</label><br />
                <input type="text" name="category" value={formData.category} onChange={handleChange} required></input><br />
                <label>Task Title</label><br />
                <input type="text" name="taskTitle" value={formData.taskTitle} maxLength={20} onChange={handleChange} required></input><br />
                <label>Creaton Date</label><br />
                <input type="date" name="creationDate" value={formData.creationDate} onChange={handleChange} required></input><br />
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                </div>
                <label>Media Type</label><br />
                <select className="create-task-select" name="mediaType" id='mediaType' value={formData.mediaType} onChange={handleChange} required >
                    <option value="">Select value</option>
                    <option value="image">Image</option>
                    <option value="audio">Audio</option>
                    <option value="video">Video</option>
                    <option value="document">Document</option>
                </select><br />
                </div>
             </fieldset>  
            <div className='createtask_button_cont'>
                <button type="submit" style={{ width: '800px', marginLeft: '0px' }}>Add Task</button>
            </div>
        </form>
    );
};
export default CreateTask;
