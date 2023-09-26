import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import { useEffect } from 'react';
import { DOMAIN } from '../Constant';
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
        fileData: [],
    }
    // console.log("locaton state is:", location.state)
    const [formData, setFormData] = useState(defaultFormData);
    const [taggers, setTaggers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const formData = new FormData();
            formData.append('image', selectedFile);
            try {
                console.log('Sending data to server:', formData);
                const response = await axios.post('http://localhost:5000/api/upload', formData);
                console.log('Server response:', response.data);
                if (response.status === 200) {
                    console.log('File uploaded successfully');
                    console.log('File path:', response.data.filePath);
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
                        fileData: updatedFileData,
                    });
                    console.log("Updated fileData:", updatedFileData);
                } else {
                    console.error('File upload failed');
                }
            } catch (error) {
                console.error('File upload error:', error);
            }
        }
    };
    // const handleChange = (e) => {


    //     console.log("vikas=", e.target.fileData)
    //     if (e.target.fileData === "fileData") {
    //         const file = e.target.files[0];
    //         const filename = file.name;
    //         const filepath = "path"; // Replace 'path' with the actual path where you want to store the file
    //         //const fileData = [{'filename': filename, 'filepath': filepath}];
    //         // console.log("hello");
    //         setFormData({
    //             ...formData
    //         });
    //     } else {
    //         console.log("world");
    //         setFormData({
    //             ...formData,
    //             [e.target.name]: e.target.value,
    //         });
    //     }
    // };



    // const handleChange = (e) => {
    //     if (e.target.name === 'fileData') {
    //         if (e.target.files.length > 0) {
    //             const file = e.target.files[0];
    //             const filename = file.name;
    //             const filepath = "path"; // Replace 'path' with the actual path where you want to store the file
    //             const updatedFileData = [
    //                 {
    //                     filename: filename,
    //                     filepath: filepath,
    //                 },
    //             ];
    //             setFormData({
    //                 ...formData,
    //                 fileData: updatedFileData,
    //             });
    //         } else {
    //             // If no file is selected, set fileData to an empty array
    //             setFormData({
    //                 ...formData,
    //                 fileData: [],
    //             });
    //         }
    //     } else {
    //         // Handle other form field changes
    //         setFormData({
    //             ...formData,
    //             [e.target.name]: e.target.value,
    //         });
    //     }
    // };

    // const handleChange = (e) => {
    //     const { name, value } = e.target;

    //     setFormData((prevData) => ({
    //         ...prevData,
    //         [name]: value,
    //     }));
    //     console.log("formdata:", formData)
    //     // For the 'fileData' field, handle it separately
    //     if (name === 'fileData' && e.target.files.length > 0) {
    //         const file = e.target.files[0];
    //         const filename = file.name;
    //         const filepath = "path"; // Replace 'path' with the actual path where you want to store the file
    //         const updatedFileData = [
    //             {
    //                 filename: filename,
    //                 filepath: filepath,
    //             },
    //         ];

    //         setFormData((prevData) => ({
    //             ...prevData,
    //             fileData: updatedFileData,
    //         }));
    //     }
    // };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...formData,
            [name]: value,
        }));

    };

    console.log("formdata:", formData); // This will correctly log the updated formData

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("handlesubmit formdata:", formData)
        const formDataToSend = {
            ...formData,
            status: 'To Do',
            fileData: JSON.stringify(formData.fileData),
        };


        console.log("formDataToSend:", formDataToSend)
        let response = await fetch(`${DOMAIN}/createtask`, {
            method: 'POST',
            body: JSON.stringify(formDataToSend),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json();
        // alert('Record added successfully');
        setFormData(defaultFormData)
        if (data.status === 200) {
            // alert('Record added successfully');
        }
        // navigate(previousRoute || '/');
        if (data.status === 200) {
            // alert('Record added successfully');
        }
        //navigate(previousRoute || '/');
        // document.getElementById("create-task").reset();
    }
    const getTaggers = () => {
        axios
            .get(`${DOMAIN}/getalltaggers`)
            .then(res => {
                const allProfiles = res.data;
                setTaggers(allProfiles);
            }).catch(error => console.error(error));
    }
    const changeSelectOptionHandler = (event) => {
        console.log("Vikas=", event.target.value);
        getProject(event.target.value);
    };
    const getProject = () => {
        axios
            .get(`${DOMAIN}/specificprojects`)
            .then(res => {
                const allProjects = res.data;
                setProjects(allProjects);
            }).catch(error => console.error(error));
    }
    useEffect(() => {
        getTaggers();
        getProject();
    }, []);
    const showAlert = () => {
        Swal.fire({
            title: '',
            text: 'Task added successfully',
            icon: 'success',
            confirmButtonText: 'OK',
        });
    };

    return (
        <form onSubmit={handleSubmit} id='create-task'>
            <fieldset style={{ border: '1px solid #000', padding: '20px', width: '800px' }}>
                <legend>Create Task:</legend>
                <div style={{ flex: 1 }}>

                    {/* Add a file input */}
                    <label>Upload File</label><br />
                    <input
                        type="file"
                        name="fileData"
                        accept=".jpg, .jpeg, .png, .gif, .mp3, .pdf, .doc, .docx"
                        onChange={handleFileChange}
                        id="fileData"
                    /><br />
                </div>
                <label>Assigned To</label><br />

                <select name="assignedTo" id="assignedTo" value={formData.assignedTo} onChange={handleChange} style={{ width: '230px' }}>
                    <option key={0} value={0}>
                        select
                    </option>
                    {taggers.length > 0 && taggers.map((tagger) => (
                        <option key={tagger.profile_id} value={tagger.profile_id}>

                            {tagger.profile_username}
                        </option>
                    ))}</select><br />
                <label>Assigned Project</label><br />

                <select name="assignedProject" id="assignedProject" value={formData.assignedProject} onChange={handleChange} style={{ width: '230px' }}>
                    <option key={0} value={0}>
                        select
                    </option>
                    {projects.length > 0 && projects.map((project) => (
                        <option key={project.project_id} value={project.project_id}>
                            {project.project_Name}
                        </option>
                    ))}</select><br />
                <label>Task Title</label><br />
                <input type="text" name="taskTitle" value={formData.taskTitle} onChange={handleChange}></input><br />
                {/* <label>Task ID</label><br />
                <input type="text" name="taskId" value={formData.taskId} onChange={handleChange}></input><br />*/}
                <label>Creaton Date</label><br />
                <input type="date" name="creationDate" value={formData.creationDate} onChange={handleChange}></input><br />
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

                </div>

                {/*<input type="text" name="assignedTo" value={formData.assignedTo} onChange={handleChange}></input><br />*/}
                {/* <label>Role</label><br />
                <select name="role" value={formData.role} onChange={handleChange}>
                    <option key={""} value={""}>
                        select
                    </option>
                    <option value="tagger">Tagger</option>
                    <option value="reviewer">Reviewer</option>
                </select><br />*/}


                <label>Media Type</label><br />
                <select name="mediaType" id='mediaType' value={formData.mediaType} onChange={handleChange}>
                    <option value="null">Select value</option>
                    <option value="image">Image</option>
                    <option value="audio">Audio</option>
                    <option value="video">Video</option>
                    <option value="document">Document</option>
                </select><br />
            </fieldset>
            <button type="submit" style={{ width: '800px', marginLeft: '0px' }} onClick={showAlert}>Add Task</button>

        </form>
    );
};


export default CreateTask;