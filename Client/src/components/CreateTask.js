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
        category: '',
        status: 'To Do', // Include the status field
    };

    const [formData, setFormData] = useState(defaultFormData);
    const [files, setFiles] = useState([]);
    const [taggers, setTaggers] = useState([]);
    const [projects, setProjects] = useState([]);

    const showAlert = () => {
        Swal.fire({
            title: '',
            text: 'Task added successfully',
            icon: 'success',
            confirmButtonText: 'OK',
        });
    };

    const handleFileChange = async (e) => {
        const selectedFiles = (e.target.files.length > 1)? Array.from(e.target.files).filter(file =>
            file.type === 'image/jpeg' || file.type === 'image/jpg'
          ): [e.target.files[0]];
        console.log(selectedFiles);
        if (selectedFiles) {
            const formDatas = new FormData();
            for (const file of selectedFiles) {
                formDatas.append('images', file);
            }
            
            try {
                const response = await axios.post(`${DOMAIN}/api/upload`, formDatas, {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                  });
                if (response.status === 200) {
                    setFormData({
                        ...formData,
                        fileName: response.data.fileName,
                        filePath: response.data.filePath
                    });
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
            status: 'To Do'
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

    const getTaggers = () => {
        axios
            .get(`${DOMAIN}/taggerandreviewerprofiles`, {
                params: {
                    role_id: 3
                }
            })
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
                        multiple
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
                <label>Folder Name</label><br />
                <input type="text" name="category" id="category" value={formData.category} onChange={handleChange}></input><br />
                <label>Task Title</label><br />
                <input type="text" name="taskTitle" value={formData.taskTitle} maxLength={20} onChange={handleChange}></input><br />
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
