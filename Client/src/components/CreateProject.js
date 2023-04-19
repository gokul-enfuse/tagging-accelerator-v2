import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import { useEffect } from 'react';
import ReactDOM from "react-dom";

const CreateProject = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const previousRoute = location.state?.previousRoute;
    console.log("locaton state is:", location.state)
    const [formData, setFormData] = useState({
        projectName: '',
        firstName: '',
        lastName: '',
        client: '',
        domain: '',
        assignTo: "",
    })

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
        console.log("formdata is:", formData)
        const response = await fetch('http://localhost:5000/create/project', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json();
        console.log(data);
        alert('Record added successfully');

        console.log("previousRoute is:", previousRoute)
        navigate(previousRoute || '/');
    }
    // const [projects, setProjects] = useState([]);

    // const getProjects = () => {

    //     axios
    //         .get("http://localhost:5000/allprojects")
    //         .then(response => {

    //             const allProjects = response.data
    //             console.log("response data is", response.data);

    //             const projectlist = allProjects.filter((item) => {
    //                 return item.projectName === "Tagger"
    //             })

    //             console.log("tagger list is", projectlist);
    //             setProjects(projectlist)
    //         })
    //         .catch(error => console.error(error));
    // }

    // useEffect(() => {
    //     getProjects();
    // }, []);

    return (
        <form onSubmit={handleSubmit}>
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
            <label><b>Assign To</b></label><br />
            <select name="assignTo" value={formData.assignTo} onChange={handleChange}>
            <option key={""} value={""}> Select</option>
            <option value="false">false</option>
            <option value="true">true</option>
            </select>
            <button type="submit">Add Project</button>
            
        </form>
    );
}
export default CreateProject;
