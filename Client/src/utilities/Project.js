import React, {useState, useEffect} from "react";
import axios from "axios";
import useAuth from '../hooks/useAuth.js';
import { DOMAIN } from '../Constant.js';

export function Project({ pname, selectedClient, selectedProject, onChange }) {
  const [projects, setProjects] = useState([]);

  // Fetch projects based on selected client
  useEffect(() => {
    if (selectedClient) {
      axios.post(`${DOMAIN}/getprojects`, { clientname: selectedClient })
        .then(res => setProjects(res.data))
        .catch(error => console.error(error));
    } else {
      setProjects([]);
    }
  }, [selectedClient]);

  return (
    <select
      name="project"
      id="project"
      value={selectedProject || ""}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: '150px', height: '30px' }}
      disabled={!selectedClient}  // Disable if no client is selected
    >
      <option value="" disabled>Select Project</option>
      {projects.map(project => (
        <option key={project.project_name} value={project.project_name}>
          {project.project_name}
        </option>
      ))}
    </select>
  );
}
