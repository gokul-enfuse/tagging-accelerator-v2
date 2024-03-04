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
    const handleChange = (e) => {
        const select = document.getElementById('projectNames');
        let selectedValues = [...select.options]
            .filter(option => option.selected)
            .map(option => option.value);
        setSelected(selectedValues)
        if (e.target.name) {
            setFormData(() => ({               
                ...formData,
                [e.target.name]: e.target.value,                
                // projectNames: selectedValues,
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        formData.id = selected
        const randomNumber = Math.floor(Math.random() * 10000);
        const username = formData.fullName.split(' ').join('')+"."+ randomNumber;
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
        showAlert();
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

        // document.getElementById("create-profile").reset();
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

    const showAlert = () => {
        Swal.fire({
          title: '',
          text: 'Profile created successfully',
          icon: 'Record added successfully',
          confirmButtonText: 'OK',
        });
      };
    
    return (
        <form className='profileContainer' onSubmit={handleSubmit} id='create-profile'>
            {/* <fieldset style={{border: '1px solid #000', padding:'20px', width:'800px'}}> */}
                {/* <legend>Create Profile:</legend> */}
                <div className='profile_content_right'>
                    <h1>List of Manager - Free</h1>
                    <select id="managerList" name="managerList" multiple style={{height: "230px"}} disabled={true}>
                        {numofmanagers.map((manager) => (
                            <option key={manager.profile_id} value={manager.profile_id} style={(manager.project_id > 0)? {color: 'red'} : {color: 'black'} }> &nbsp; {manager.profile_username} - {(manager.project_id > 0) ? 'Project Assigned' : 'No Project Assign'}</option>
                        ))}
                    </select>
                </div>
                <div className='profile_content'>
                <h1>Create Profile (Manager)</h1>
                <label><b>Project Name</b></label><br />
                <select id="projectNames" name="projectNames" onClick={e => handleChange(e)} multiple style={{height: "50%"}}>

                    {projectList.map((project) => (
                        <option key={project.project_id} value={project.project_id} >
                            {project.project_Name}
                        </option>
                    ))}
                </select><br />
                <label><b>Manager's Full Name</b></label><br />
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required></input><br />
                <label><b>Email</b></label><br />
                <input type="text" name="email" value={formData.email} onChange={handleChange} required></input><br />
                </div>
            {/* </fieldset> */}
            <div className='profile_button_cont'>
                <button type="submit" style={{ width: '800px', marginLeft: '0px' }} >Add Profile</button>
            </div>
        </form>
    );
};

export default CreateProfile;