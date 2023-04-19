import React, { useState } from 'react';
import { useEffect } from 'react';


const CreateProfile = () => {
    const [formData, setFormData] = useState({
        projectNames: [],
        fullName: '',
        email: '',
    })
    const [selected, setSelected] = useState([]);
    const handleChange = (e) => {
        // console.log("querySelectorAll:", e.target.form.querySelectorAll('[name=projectNames]'))
        // const selectedProjects = Array.from(e.target.form.querySelectorAll('[name=projectNames]:select')).map((checkbox) => checkbox.value);
        // console.log("selected project is:", selectedProjects)
        const select = document.getElementById('projectNames');
        let selectedValues = [...select.options]
            .filter(option => option.selected)
            .map(option => option.value);
        console.log("selected:", selectedValues)
        setSelected(selectedValues)
        if (e.target.name) {
            setFormData(() => ({
                ...formData,
                [e.target.name]: e.target.value,
                // projectNames: selectedValues,

            }))
        }

        console.log("formData1:", formData)
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        formData.projectNames = selected
        console.log("formData:", formData)

        const username = formData.email;
        const password = Math.random().toString(36).slice(-8);
        if (!formData.fullName) {
            return
        }
        const formDataWithDetails =
        {
            ...formData,
            username: username,
            password: password,
            confirmPassword: password,
            role:"Manager"
        }
        const response = await fetch('http://localhost:5000/create/profile', {
            method: 'POST',
            body: JSON.stringify(formDataWithDetails),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json();
        console.log(data);
    }
    const [projectList, setProjectList] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const response = await fetch('http://localhost:5000/allprojects');
            const data = await response.json();
            console.log("data is:", data)
            setProjectList(data);
        };
        fetchProjects();
    }, []);


    return (
        <form onSubmit={handleSubmit}>
            <label><b>Project Name</b></label><br />
            <select id="projectNames" name="projectNames" onClick={e => handleChange(e)} multiple>

                {projectList.map((project) => (
                    <option key={project._id} value={project.projectName}>

                        {project.projectName}
                    </option>
                ))} 
            </select><br />
            <label><b>Manager's Full Name</b></label><br />
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required></input><br />
            <label><b>Email</b></label><br />
            <input type="text" name="email" value={formData.email} onChange={handleChange}></input><br />
            {/*<label>Username</label><br />
            <input type="text" name="username" value={formData.username} onChange={handleChange}></input><br />
            <label>Password</label><br />
            <input type="text" name="password" value={formData.password} onChange={handleChange}></input><br />
            <label>Confirm Password</label><br />
            <input type="text" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}></input><br />
            <label>Role</label><br />
            <select name="role" value={formData.role} onChange={handleChange}> <br />
                <option key={""} value={""}> Select</option>
                <option value="Manager">Manager</option>
                <option value="Tagger">Tagger</option>
                <option value="Reviewer">Reviewer</option>
    <option value="Admin">Admin</option>


            </select><br />*/}


            <button type="submit">Add Profile</button>
        </form>
    );
};

export default CreateProfile;