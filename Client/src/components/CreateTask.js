import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import { useEffect } from 'react';



const CreateTask = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const previousRoute = location.state?.previousRoute;
    // console.log("locaton state is:", location.state)
    const [formData, setFormData] = useState({
        taskTitle: '',
        taskId: '',
        status: '',
        assignedProject: '',
        assignedTo: 0,
        reviewer_profile_id: '',
        role: 0,
        creationDate: '',
    });
    const [taggers, setTaggers] = useState([]);
    const [projects, setProjects] = useState([]);


    const handleChange = (e) => {
        setFormData(() => ({
            ...formData,
            [e.target.name]: e.target.value
        }))
    }
    console.log("formdata:", formData)
    const handleSubmit = async (e) => {
        e.preventDefault();
        let response = await fetch('http://localhost:5000/createtask', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json();
        alert('Record added successfully');
        setFormData({
            taskTitle: '',
            taskId: '',
            status: '',
            assignedProject: '',
            assignedTo: 0,
            reviewer_profile_id: '',
            role: 0,
            creationDate: '',
        })
        if(data.status === 200) {
            alert('Record added successfully');
        }
        // navigate(previousRoute || '/');
        if(data.status === 200) {
            alert('Record added successfully');
        }
        //navigate(previousRoute || '/');
        // document.getElementById("create-task").reset();
    }


    const getTaggers = () => {
        axios
            .get("http://localhost:5000/getalltaggers")
            .then(res=> {                
                const allProfiles = res.data;
                setTaggers(allProfiles);
            }).catch(error => console.error(error));
    }

    const changeSelectOptionHandler = (event) => {
        console.log("Vikas=",event.target.value);
        getProject(event.target.value);
    };

    const getProject = () => {
        axios
            .get(`http://localhost:5000/specificprojects`)
            .then(res=> {                
                const allProjects = res.data;
                setProjects(allProjects);
            }).catch(error => console.error(error));
    }

    useEffect(() => {
        getTaggers();
        getProject();
    }, []);

    // const handleClick = () => {
    //     alert('Record added successfully');
    //     navigate(previousRoute || '/');
    // };

    return (
        <form onSubmit={handleSubmit} id='create-task'>
            <fieldset style={{border: '1px solid #000', padding:'20px', width:'800px'}}>
            <legend>Create Task:</legend>
                <label>Assigned To</label><br />

                <select name="assignedTo" id="assignedTo" value={formData.assignedTo} onChange={handleChange} style={{width: '230px'}}>
                    <option key={0} value={0}>
                        select
                    </option>
                    {taggers.length > 0 && taggers.map((tagger) => (
                        <option key={tagger.profile_id} value={tagger.profile_id}>

                            {tagger.profile_username}
                        </option>
                    ))}</select><br />
                <label>Assigned Project</label><br />

                <select name="assignedProject" id="assignedProject" value={formData.assignedProject} onChange={handleChange} style={{width: '230px'}}>
                    <option key={0} value={0}>
                        select
                    </option>
                    {projects.length > 0 && projects.map((project) => (
                        <option key={project.project_id} value={project.project_id}>

                            {project.project_Name}
                        </option>
                    ))}</select><br />
                <label>Task Title</label><br />
                <input type="text" name="taskTitle" value={formData.taskTitle} onChange={handleChange}></input><br />
                 {/* <label>Task ID</label><br />
                <input type="text" name="taskId" value={formData.taskId} onChange={handleChange}></input><br />*/}
                <label>Creaton Date</label><br />
                <input type="date" name="creationDate" value={formData.creationDate} onChange={handleChange}></input><br />
                

                {/*<input type="text" name="assignedTo" value={formData.assignedTo} onChange={handleChange}></input><br />*/}
                {/* <label>Role</label><br />
                <select name="role" value={formData.role} onChange={handleChange}>
                    <option key={""} value={""}>
                        select
                    </option>
                    <option value="tagger">Tagger</option>
                    <option value="reviewer">Reviewer</option>
                </select><br />*/}


                {/* <label>Status</label><br />
                <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="inProgress">In progress</option>
                    <option value="completed">Complted</option>
                    <option value="waitingForReview">Waiting For Review</option>

                </select><br />*/}
            </fieldset>
            <button type="submit" style={{ width: '800px', marginLeft: '0px' }}>Add Task</button>

        </form>
    );
};


export default CreateTask;