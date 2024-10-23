import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { DOMAIN, DOMAINCLIENT, MEDIAMANUALPATH } from '../Constant';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import commonfunction from '../utilities/commonFunction';

const CreateTask = () => {
    const [currentDate, setCurrentDate] = useState('');
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
    };

    const [formData, setFormData] = useState(defaultFormData);
    const [files, setFiles] = useState([]);
    const [taggers, setTaggers] = useState([]);
    const [projects, setProjects] = useState([]);

    const showAlert = (arg, info) => {
        Swal.fire({
            title: '',
            text: arg,
            icon: info,
            confirmButtonText: 'OK',
        });
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        const allowedImageExtensions = ['jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png'];
        const allowedDocumentExtensions = ['docx', 'pdf'];
        const maxFileSize = 3 * 1024 * 1024; // 3 MB per file
        const totalMaxSize = 3 * 1024 * 1024; // Total max size (e.g., 3 MB)
    
        let totalSize = 0;
        let isValid = true;
        let isImageType = false;
        let isDocumentType = false;
        let errorMessage = '';
    
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileExtension = file.name.split('.').pop().toLowerCase();
    
            // Check if the file is an image or document
            if (allowedImageExtensions.includes(fileExtension)) {
                isImageType = true;
            } else if (allowedDocumentExtensions.includes(fileExtension)) {
                isDocumentType = true;
            } else {
                errorMessage = 'Only .jpg, .jpeg, .jfif, .pjpeg, .pjp, .png, and .docx files are allowed.';
                isValid = false;
                break;
            }
    
            // File size validation
            if (file.size > maxFileSize) {
                errorMessage = 'Each file must be 3 MB or smaller.';
                isValid = false;
                break;
            }
    
            // Total size validation
            totalSize += file.size;
            if (totalSize > totalMaxSize) {
                errorMessage = 'Total size of all files must not exceed 3 MB.';
                isValid = false;
                break;
            }
        }
    
        if (!isValid) {
            showAlert(errorMessage, 'warning');
            e.target.value = '';
            setFormData((prevData) => ({ ...prevData, mediaType: '' }));
            return;
        }
    
        if (isImageType && isDocumentType) {
            showAlert('You cannot upload both images and documents at the same time.', 'warning');
            e.target.value = '';
            setFormData((prevData) => ({ ...prevData, mediaType: '' }));
            commonfunction.unlinkfiles(formData);
            return;
        }
    
        // Validation for media type and file types matching
        if (isImageType && formData.mediaType && formData.mediaType !== 'image') {
            showAlert('Media type does not match the selected file type. Please select "Image" as media type.', 'warning');
            e.target.value = '';
            setFormData((prevData) => ({ ...prevData, mediaType: '' }));
            commonfunction.unlinkfiles(formData);
            return;
        } else if (isDocumentType && formData.mediaType && formData.mediaType !== 'doc') {
            showAlert('Media type does not match the selected file type. Please select "Document" as media type.', 'warning');
            e.target.value = '';
            setFormData((prevData) => ({ ...prevData, mediaType: '' }));
            commonfunction.unlinkfiles(formData);
            return;
        }
    
        const formDatas = new FormData();
        for (const file of files) {
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
                    filePath: response.data.filePath,
                });
            } else {
                console.error('File upload failed');
                showAlert('File upload failed', 'error');
            }
        } catch (error) {
            console.error('File upload error:', error);
            showAlert('File upload error', 'error');
        }
    
        setFiles(files);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(files)
        // Validate media type selection based on existing files
        if (name === 'mediaType' && files.length > 0) {
            const fileExtension = files[0].name.split('.').pop().toLowerCase();
            const allowedImageExtensions = ['jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png'];
            const allowedDocumentExtensions = ['docx', 'pdf'];
    
            // Check for mismatch between selected media type and file types
            if (value === 'image' && !allowedImageExtensions.includes(fileExtension)) {
                showAlert('You have selected document files. Please select "Document" as media type.', 'warning');
                setFormData((prevData) => ({ ...prevData, mediaType: '' }));
                commonfunction.unlinkfiles(formData);
                return;
            }
    
            if (value === 'doc' && !allowedDocumentExtensions.includes(fileExtension)) {
                showAlert('You have selected image files. Please select "Image" as media type.', 'warning');
                setFormData((prevData) => ({ ...prevData, mediaType: '' }));
                commonfunction.unlinkfiles(formData);
                return;
            }
        }
    
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
                showAlert(response.data.message, 'success');
                setFormData(defaultFormData); // Reset the form
            } else {
                console.error('Task creation failed');
                showAlert(response.data.message, 'info');
            }
        } catch (error) {
            showAlert(error.response.data.message, 'error');
            setFormData(defaultFormData); // Reset the form
           // console.error('Error creating task:', error);
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
        let currentDateLimit = new Date().toJSON().substring(0, 10);
        setCurrentDate(currentDateLimit); 
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
                <input type="date" name="creationDate" value={formData.creationDate} onChange={handleChange} min={currentDate} required></input><br />
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                </div>
                <label>Media Type</label><br />
                <select className="create-task-select" name="mediaType" id='mediaType' value={formData.mediaType} onChange={handleChange} required >
                    <option value="">Select value</option>
                    <option value="image">Image</option>
                    <option value="audio" disabled>Audio</option>
                    <option value="video" disabled>Video</option>
                    <option value="doc">Document</option>
                </select><br />
                </div>
             </fieldset>  
            <div className='createtask_button_cont'>
                <button type="submit" className='Btn' style={{ width: '800px', margin: '10px' }}>Add Task</button>
            </div>
        </form>
    );
};
export default CreateTask;
