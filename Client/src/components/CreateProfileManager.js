import React, { useState } from 'react';
import { useEffect } from 'react';
const localhost = '52.44.231.112';

const CreateProfileManager = () => {
    const [formData, setFormData] = useState({
        id: [],
        fullName: '',
        email: '',
        role: ''
    })
    const [selected, setSelected] = useState([]);
    const handleChange = (e) => {
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
        formData.id = selected
        console.log("formData:", formData)

        const username = formData.email;
        const password = Math.random().toString(36).slice(-8);
        /*  if (!formData.fullName) {
             return
         } */
        const formDataWithDetails =
        {
            ...formData,
            name: formData.fullName,
            fullname: formData.fullName,
            username: username,
            password: password,
            confirmPassword: password,

        }
        console.log("formData before api:", formData)

        const response = await fetch('http://${localhost}:5000/create/profile', {
            method: 'POST',
            body: JSON.stringify(formDataWithDetails),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data);
        alert('Record added successfully');
        setFormData({
            id: [],
            fullName: '',
            email: '',
            role: '',
            name: '',
            username: '',
            password: '',
            confirmPassword: '',
        })
        alert(data.message)
        // document.getElementById("create-task").reset();
    }
    const [projectList, setProjectList] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const response = await fetch('http://${localhost}:5000/allprojects');
            const data = await response.json();
            console.log("data is:", data)
            setProjectList(data);
        };
        fetchProjects();
    }, []);


    return (
        <form onSubmit={handleSubmit} id='create-task'>
            <fieldset style={{border: '1px solid #000', padding:'20px', width:'800px'}}>
            <legend>Create Profile (Tagger & Reviewer):</legend>
                <label><b>Project Name</b></label><br />
                <select id="projectNames" name="projectNames" onClick={e => handleChange(e)} multiple>

                    {projectList.map((project) => (
                        <option key={project.project_id} value={project.project_id}>

                            {project.project_Name}
                        </option>
                    ))}
                </select><br />
                <label><b>Full Name</b></label><br />
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required></input><br />
                <label><b>Email</b></label><br />
                <input type="text" name="email" value={formData.email} onChange={handleChange}></input><br />
                <label>Role</label><br />
                <select name="role" value={formData.role} onChange={handleChange}>
                    <option key={""} value={""}> Select</option>
                    <option value="3">Tagger</option>
                    <option value="4">Reviewer</option>
                </select><br />
            </fieldset>
            <button type="submit" style={{ width: '800px', marginLeft: '0px' }}>Add Profile</button>
        </form>
    );
};
export default CreateProfileManager;