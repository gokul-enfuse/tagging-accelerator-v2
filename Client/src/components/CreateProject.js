import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import { useEffect } from 'react';
import ReactDOM from "react-dom";
import { DOMAIN } from '../Constant';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import '../App.css';


const CreateProject = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const previousRoute = location.state?.previousRoute;
    const defaultFormValues = {
        projectName: '',
        firstName: '',
        lastName: '',
        client: '',
        domain: '',
        assignTo: 0,
    }
    const [formData, setFormData] = useState(defaultFormValues)

    const handleChange = (e, isProjectName) => {
        if (isProjectName) {
            e.target.value = ("" + e.target.value).toUpperCase();
        }
        setFormData(() => ({
            ...formData,
            [e.target.name]: e.target.value
        }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios.get(`${DOMAIN}/allprojects`).then(async response => {
            const allProjects = response.data;
            const projectNames = allProjects.map(project => project.project_Name);
            if (projectNames.includes(formData.projectName)) {
                showAlert(`A project with name "${formData.projectName}" already exists. Please choose a different name.`, 'error');
                return;
            }
            else {
                const response = await fetch(`${DOMAIN}/create/project`, {
                    method: 'POST',
                    body: JSON.stringify(formData),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const data = await response.json();
                showAlert('Project added successfully', "success");
                setFormData(defaultFormValues)
            }
        });
        // navigate(previousRoute || '/');
        //navigate(previousRoute || '/');
        // document.getElementById("create-project").reset();
    }
    const showAlert = (message, icon) => {
        Swal.fire({
            title: '',
            text: message,
            icon: icon,
            confirmButtonText: 'OK',
        });
    };
    return (
        <form className='projectContainer' onSubmit={handleSubmit} id='create-project'>
            {/* <fieldset style={{ border: '1px solid #000', padding: '20px', width: '800px' }}> */}
                {/* <legend>Create Project:</legend> */}
            <div className='project_content'>
                <h1>Create Project</h1>
                <label><b>Project Name </b></label><br />
                <input type="text" name="projectName" value={formData.projectName} onChange={e => handleChange(e, true)} ></input><br />
                {/*<label><b>Manager</b></label><br />
                <input type="text" placeholder="First name" name="firstName" value={formData.firstName} onChange={handleChange}></input> <br /><br />
        <input type="text" placeholder="Last name" name="lastName" value={formData.lastName} onChange={handleChange}></input><br />*/}
                <label><b>Client</b></label><br />
                <input type="text" name="client" value={formData.client} onChange={handleChange}></input><br />
                <label><b>Domain</b></label><br />

                <select name="domain" value={formData.domain} onChange={handleChange}>
                    <option key={""} value={""}> Select</option>
                    <option value="imageTagging">Image tagging</option>
                    <option value="textAnnotation">Text annotation</option>
                    <option value="videoTagging">Video tagging</option>
                    <option value="audioTagging">Audio tagging</option>
                </select><br />
                {/* <label><b>Assign To</b></label><br />
                <select name="assignTo" value={formData.assignTo} onChange={handleChange}>
                    <option key={""} value={""}> Select</option>
                    <option value="0">false</option>
                    <option value="1">true</option>
                </select> */}
            {/* </fieldset> */}
            </div>
            <div className='project_button_cont'>
                <button type="submit" style={{ width: '100px', marginLeft: '0px' }}>Add Project</button>
            </div>
        </form>
    );
}
export default CreateProject;
