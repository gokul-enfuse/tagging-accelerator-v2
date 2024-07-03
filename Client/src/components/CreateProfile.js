import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { DOMAIN } from '../Constant';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
// import '../app.css'

const CreateProfile = () => {
    const [formData, setFormData] = useState({
        id: [],
        fullName: '',
        email: '',
    })
    const [selected, setSelected] = useState([]);
    const [numofmanagers, setNumOfManagers] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const [email, setEmail] = useState('');
    const [validationMessage, setValidationMessage] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const localPart = email.substring(0, email.indexOf('@'));
        const localPartInvalidSymbols = /[^\w.]/;
        const atIndex = email.indexOf('@');
        const domainPart = email.substring(atIndex + 1);
        const dotIndex = email.lastIndexOf('.');
        if (!emailRegex.test(email)) {
            return false;
        }
        if (localPart.startsWith('.') || localPart.startsWith('_')) {
            return false;
        }
        if (localPartInvalidSymbols.test(localPart)) {
            return false;
        }
        if (localPart.includes('..')) {
            return false;
        }
        if (/\d/.test(domainPart)) {
            return false;
        }
        if (dotIndex === email.length - 1 || dotIndex < atIndex) {
            return false;
        }
        return true;
    };

    const handleChange = (e) => {
        const select = document.getElementById('projectNames');
        let selectedValues = [...select.options]
            .filter(option => option.selected)
            .map(option => option.value);
        setSelected(selectedValues)
        if (e.target.name) {
            if (e.target.name == 'email') {
                setEmail(e.target.value);
            }
            setFormData(() => ({
                ...formData,
                [e.target.name]: e.target.value,
                // projectNames: selectedValues,
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateEmail(email)) {
            setValidationMessage('')

            formData.id = selected
            const randomNumber = Math.floor(Math.random() * 10000);
            const username = formData.fullName.split(' ').join('') + "." + randomNumber;
            const password = Math.random().toString(36).slice(-8);
            /* if (!formData.fullName) {
                return
            } */
            const formDataWithDetails = {
                ...formData,
                name: formData.fullName,
                fullname: formData.fullName,
                username: username,
                password: password,
                confirmPassword: password,
                role: 2
            }
            const response = await fetch(`${DOMAIN}/create/profile`, {
                method: 'POST',
                body: JSON.stringify(formDataWithDetails),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json();
            showAlert(data.message, 'info');
            setFormData({
                id: [],
                fullName: '',
                email: '',
                name: '',
                username: '',
                password: '',
                confirmPassword: '',
                role: 2
            })

        } else {
            setValidationMessage('Invalid email, please provide valid email.');
        }
    }
/**
 * Created By: Vikas Bose | 08/02/2024
 */    
    const getListOfManager = async() => {
        await axios.get(`${DOMAIN}/listoworker`, {
            params: {
                role_id: 2
            }
        }).then(response => {
            setNumOfManagers(response.data);
        }).catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        const fetchProjects = async () => {
            const response = await fetch(`${DOMAIN}/allprojects`);
            const data = await response.json();
            setProjectList(data);
        };
        fetchProjects();
        getListOfManager();
    }, []);

    const showAlert = (arg, icon) => {
        Swal.fire({
            title: '',
            text: arg,
            icon: icon,
            confirmButtonText: 'OK',
        });
    };

    return (
        <form className='profileContainer' onSubmit={handleSubmit} id='create-profile'>
            {/* <fieldset style={{border: '1px solid #000', padding:'20px', width:'800px'}}> */}
            {/* <legend>Create Profile:</legend> */}
            <div id='profile_content_wrapper'>
                <div className='profile_content'>
                    <h1>Create Profile (Manager)</h1>
                    <label><b>Project Name</b></label><br />
                    <select id="projectNames" name="projectNames" onClick={e => handleChange(e)} multiple style={{ height: "35%" }} required>

                        {projectList.map((project) => (
                            <option key={project.project_id} value={project.project_id} >
                                {project.project_Name}
                            </option>
                        ))}
                    </select><br />
                    <label><b>Manager's Full Name</b></label><br />
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required></input><br />
                    <label><b>Email</b></label><br />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required></input><br />
                    {validateEmail != '' ? <p style={{ color: 'red' }}>{validationMessage}</p> : null}
                </div>
                <div className='profile_content'>
                    <h1>List of Manager</h1><br />
                    <select id="managerList" name="managerList" multiple disabled={true}>
                        {numofmanagers.map((manager) => (
                            <option key={manager.profile_id} value={manager.profile_id} style={(manager.project_id > 0) ? { color: 'red' } : { color: 'black' }}> &nbsp; {manager.profile_username} - {(manager.project_id > 0) ? 'Project Assigned' : 'No Project Assign'}</option>
                        ))}
                    </select>
                </div>
            </div>
            {/* </fieldset> */}
            <div className='profile_button_cont'>
                <button type="submit" style={{ width: '800px', marginLeft: '0px' }} >Add Profile</button>
            </div>
        </form>
    );
};

export default CreateProfile;