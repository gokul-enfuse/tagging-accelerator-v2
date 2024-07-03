import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { DOMAIN } from '../Constant';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';

const CreateProfileManager = () => {
    const [formData, setFormData] = useState({
        id: [],
        fullName: '',
        email: '',
        role: ''
    })
    const [selected, setSelected] = useState([]);
    const [numOfWorkers, setNumOfWorkers] = useState([]);
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
        /* const select = document.getElementById('projectNames');
        let selectedValues = [...select.options]
            .filter(option => option.selected)
            .map(option => option.value);
        setSelected(selectedValues) */
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
            setValidationMessage('');

            formData.id = selected;
            const randomNumber = Math.floor(Math.random() * 10000);
            const username = formData.fullName.split(' ').join('') + "." + randomNumber;
            const password = Math.random().toString(36).slice(-8);
            /*  if (!formData.fullName) {
                 return
             } */
            const formDataWithDetails = {
                ...formData,
                name: formData.fullName,
                fullname: formData.fullName,
                username: username,
                password: password,
                confirmPassword: password,
            }

            const response = await fetch(`${DOMAIN}/create/profile`, {
                method: 'POST',
                body: JSON.stringify(formDataWithDetails),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            showAlert(data.message, 'info');
            setFormData({
                id: [],
                fullName: '',
                email: '',
                role: '',
                name: '',
                username: '',
                password: '',
                confirmPassword: '',
            });
        } else {
            setValidationMessage('Invalid email, please provide valid email.');
        }
    }
    const [projectList, setProjectList] = useState([]);

/**
* Created By: Vikas Bose | 08/02/2024
*/    
    const getListOfManager = async() => {
        await axios.get(`${DOMAIN}/listoworker`, {
            params: {
                role_id: "3,4"
            }
        }).then(response => {
            setNumOfWorkers(response.data);
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

    let workersRoleArray = { 3: 'Tagger', 4: 'Reviewer' };
    return (
        <form className='create_tagger_reviewrs_container' onSubmit={handleSubmit} id='create-task'>
            {/* <fieldset style={{ border: '1px solid #000', padding: '20px', width: '800px' }}> */}
            <div id='profile_content_wrapper'>
                <div className='create_tagger_reviewrs_content'>
                    <h1>Create Profile (Tagger & Reviewer):</h1>
                    {/* <label><b>Project Name</b></label><br />
                <select id="projectNames" name="projectNames" onClick={e => handleChange(e)} multiple style={{height: "50%"}} required>
                    {projectList.map((project) => (
                        <option key={project.project_id} value={project.project_id}>
                            {project.project_Name}
                        </option>
                    ))}
                </select> */}
                    <br />
                    <label><b>Full Name</b></label><br />
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required></input><br />
                    <label><b>Email</b></label><br />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required></input><br />
                    {validateEmail != '' ? <p style={{ color: 'red' }}>{validationMessage}</p> : null}
                    <label><b>Role</b></label><br />
                    <select name="role" value={formData.role} onChange={handleChange} required>
                        <option key={""} value={""}> Select</option>
                        <option value="3">Tagger</option>
                        <option value="4">Reviewer</option>
                    </select><br />
                </div>
                <div className='profile_content_right'>
                    <h1>List of Taggers & Reviewers</h1>
                    <select id="CProfileManagerList" name="managerList" multiple disabled={true}>
                        {numOfWorkers.map((worker) => (
                            <option key={worker.profile_id} value={worker.profile_id} style={(worker.project_id.length > 0) ? { color: 'red' } : { color: 'black' }}>&nbsp;{(worker.project_id.length > 0) ? 'A' : 'NA'}- {worker.profile_username}[{workersRoleArray[worker.profile_role]}]</option>
                        ))}
                    </select>
                </div>

            </div>
            {/* </fieldset> */}
            <div className='create_tagger_reviewrs_button_cont'>
                <button type="submit" style={{ width: '800px', marginLeft: '0px' }}>Add Profile</button>
            </div>
        </form>
    );
};
export default CreateProfileManager;