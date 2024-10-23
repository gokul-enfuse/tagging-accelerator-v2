import React, {useState, useEffect} from "react";
import axios from "axios";
import { Table, Select } from 'antd';
import useAuth from '../hooks/useAuth.js';
import { DOMAIN } from '../Constant.js';

export function AssignToReviewer({ pname, record, mismatchedTasks }) {
    let { auth } = useAuth();
    let defaultFormData = {
      taskTitle: '',
      taskId: '',
      status: 'waiting for review',
      assignedProject: '',
      assignedTo: '',
      reviewer_profile_id: '',
      role: 4,
      creationDate: '',
      mediaType: '',
      fileName: '',
      filePath: ''
    }
    let [formData, setFormData] = useState(defaultFormData);    
    let [reviewers, setReviewers] = useState([]);
    
    let handleChange = (e) => {
      const { value } = e.target;
      setFormData({
        assignedTo: value,
      });
      // Call the backend API to update the assignment
      axios
        .post(`${DOMAIN}/updateAssignment/${record.task_id}`, {
          record, assignedTo: value,
        })
        .then((response) => {
          console.log("Assignment updated successfully:", response.data);
        })
        .catch((error) => console.error("Error updating assignment:", error));
    };

    let getReviewers = () => {
      axios
        .get(`${DOMAIN}/getreviewername`)
        .then(res => {
          const allProfiles = res.data;
          setReviewers(allProfiles);
        }).catch(error => console.error(error));
    }
    useEffect(() => {
      getReviewers();
    }, []);

    let isIndividualLogin = auth.profile_role !== 1 && auth.profile_role !== 2;

    return (
      <select
        name="assignedTo"
        id="assignedTo"
        value={formData.assignedTo || record.reviewer_profile_id}
        onChange={handleChange}
        style={{ width: '150px', height: '30px' }}
        /* disabled={isIndividualLogin} */
        disabled>
        <option value="" key={0}>Select</option>
        {reviewers.length > 0 &&
          reviewers.map((reviewer) => (
            <option key={reviewer.reviewer_profile_id} value={reviewer.reviewer_profile_id} > 
              {reviewer.profile_username}
            </option>
          ))}
      </select>
    )

 };

export function AssignToTagger({ pname, record, mismatchedTasks }) {
    let { auth } = useAuth();
    let defaultFormData = {
        taskTitle: '',
        taskId: '',
        status: 'To do',
        assignedProject: '',
        assignedTo: '',
        reviewer_profile_id: '',
        role: 3,
        creationDate: '',
        mediaType: '',
        fileName: '',
        filePath: ''
      }
      let [formData, setFormData] = useState(defaultFormData);
      let [taggers, setTaggers] = useState([]);
  
      let handleChange = (e) => {
        const { value } = e.target;
        setFormData({
          assignedTo: value,
        });
  
        // Call the backend API to update the assignment
        axios
          .post(`${DOMAIN}/updateAssignment/${record.task_id}`, {
            record, assignedTo: value,
          })
          .then((response) => {
            console.log("Assignment updated successfully:", response.data);
          })
          .catch((error) => console.error("Error updating assignment:", error));
      };
  
      let getTaggers = () => {
        axios
          .get(`${DOMAIN}/getalltaggers`)
          .then(res => {
            const allProfiles = res.data;
            setTaggers(allProfiles);
          }).catch(error => console.error(error));
      }
      useEffect(() => {
        getTaggers();
      }, []);
      let findTaggerById = (profileId) => taggers.find(tagger => tagger.profile_id === profileId);
  
      let isIndividualLogin = auth.profile_role !== 1 && auth.profile_role !== 2;

      return (
        <select
          name="assignedTo"
          id="assignedTo"
          value={formData.assignedTo || findTaggerById(record.profile_id)?.profile_id || ''}
          onChange={handleChange}
          style={{ width: '150px', height: '30px' }}
          /* disabled={isIndividualLogin} */ 
          disabled
        >
          <option value="" key={0}>Select</option>
          {taggers.length > 0 &&
            taggers.map((tagger) => (
              <option
                key={tagger.profile_id}
                value={tagger.profile_id}
              >
                {tagger.profile_username}
              </option>
            ))}
        </select>
      )
 };

export function PriprityLevel({record}) {
  const { Option } = Select;
  const [priorityLevel, setPriorityLevel] = useState({});

  useEffect(() => {
    setPriorityLevel(() => (record.task_prioroty !== 0 ? record.task_prioroty : "Selcted"));
  }, [])
  const handlePriortyLevelChange = (e) => {
    setPriorityLevel(e)
    console.log(record, e);
  }
   return (
      <Select 
        name="prioritylevel"
        id="prioritylevel"
        style={{ width: 120 }}
        value={priorityLevel}
        onChange={handlePriortyLevelChange}
      >
        {
          [1,2,3,4,5].map((level) => (
            
              <Option key={level} value={level}>{level}</Option>
          ))
        }
      </Select>
   )
};
