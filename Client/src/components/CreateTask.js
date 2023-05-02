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
        creationDate: '',
        assignedTo: 0,
        role: 0,
    });
    const [taggers, setTaggers] = useState([]);


    const handleChange = (e) => {
        setFormData(() => ({
            ...formData,
            [e.target.name]: e.target.value
        }))
    }
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
            creationDate: '',
            assignedTo: 0,
            role: 0,
        })
        // if(data.status === 200) {
        //     alert('Record added successfully');
        // }
        // navigate(previousRoute || '/');
    }


    const getTaggers = () => {
        axios
            .get("http://localhost:5000/getalltaggers")
            .then(res => {
                // console.log(res);
                const allProfiles = res.data;
                setTaggers(allProfiles);
            }).catch(error => console.error(error));
    }

    useEffect(() => {
        getTaggers();
    }, []);

    // const handleClick = () => {
    //     alert('Record added successfully');
    //     navigate(previousRoute || '/');
    // };

    return (
        <form onSubmit={handleSubmit}>
            <fieldset style={{ border: '1px solid #000', padding: '20px', width: '800px' }}>
                <legend>Create Task:</legend>
                <label>Task Title</label><br />
                <input type="text" name="taskTitle" value={formData.taskTitle} onChange={handleChange}></input><br />
                 {/* <label>Task ID</label><br />
                <input type="text" name="taskId" value={formData.taskId} onChange={handleChange}></input><br />*/}
                <label>Creaton Date</label><br />
                <input type="date" name="creationDate" value={formData.creationDate} onChange={handleChange}></input><br />
                <label>Assigned To</label><br />

                <select name="assignedTo" id="assignedTo" value={formData.assignedTo} onChange={handleChange}>
                    <option key={0} value={0}>
                        select
                    </option>
                    {taggers && taggers.map((tagger) => (
                        <option key={tagger.profile_id} value={tagger.profile_id}>

                            {tagger.profile_username}
                        </option>
                    ))}</select><br />

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