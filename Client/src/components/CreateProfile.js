import React, { useState } from 'react';
import { useEffect } from 'react';
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
        //console.log("formData:", formData)
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
        console.log("data", data);
        // alert('Record added successfully');
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
    const [projectList, setProjectList] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const response = await fetch(`${DOMAIN}/allprojects`);
            const data = await response.json();
            setProjectList(data);
        };
        fetchProjects();
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
                <div className='profile_content'>
                <h1>Create Profile</h1>
                <label><b>Project Name</b></label><br />
                <select id="projectNames" name="projectNames" onClick={e => handleChange(e)} multiple>

                    {projectList.map((project) => (
                        <option key={project.project_id} value={project.project_id} >
                            {project.project_Name}
                        </option>
                    ))}
                </select><br />
                <label><b>Manager's Full Name</b></label><br />
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required></input><br />
                <label><b>Email</b></label><br />
                <input type="text" name="email" value={formData.email} onChange={handleChange}></input><br />
                </div>
            {/* </fieldset> */}
            <div className='profile_button_cont'>
                <button type="submit" style={{ width: '800px', marginLeft: '0px' }} >Add Profile</button>
            </div>
        </form>
    );
};

export default CreateProfile;