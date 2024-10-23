import { Table, Select, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth.js';
import axios from "axios";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import 'antd/dist/antd.min.css';
import { DOMAIN, DOMAINCLIENT } from '../Constant.js';
import { AssignToTagger } from '../utilities/Assignto.js';
import { Client } from '../utilities/Client.js';
import { Project } from '../utilities/Project.js';
import usePageVisibility from '../utilities/usePageVisibility';

const FilterData = ({searchValue}) => {
  const { Option } = Select;
  const { auth } = useAuth();
  const [data, setData] = useState([]);
  const [finalData, setFinalData] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  // Columns for the table
  const columnsRow = [
    { title: 'Project', dataIndex: 'project_name', key: 'project_name' },
    { title: 'Client', dataIndex: 'project_clientname', key: 'project_clientname' },
    { title: 'Project Domain', dataIndex: 'project_domain', key: 'project_domain' },
    { title: 'Project Status', dataIndex: 'project_status', key: 'project_status' },
    { title: 'Created Date', dataIndex: 'createdDate', key: 'createdDate' },
    { title: 'Modified Date', dataIndex: 'modifiedDate', key: 'modifiedDate' }
  ];

  // Fetch all projects and clients
  const getProjectsClients = () => {
    axios
      .get(`${DOMAIN}/getProjectsClients`, {
        params: { profile_id: auth.profile_id, profile_role: auth.profile_role }
      })
      .then((response) => {
        const tasks = response.data;
        setData(tasks);
        setFinalData(tasks);  // By default, display all data
      })
      .catch((error) => console.error(error));
  };

  // Filter projects based on the selected client
  const handleClientChange = (clientName) => {
    // setSelectedClient(clientName);
    // setSelectedProject(null); // Reset project selection

    // const filteredData = data.filter(item => item.project_clientname === clientName);
    // setFinalData(filteredData); // Display only filtered data

    setSelectedClient(clientName);
    setSelectedProject(null); // Reset project selection

    // Make API call to filter projects based on selected client
    axios.get(`${DOMAIN}/getProjectsClients`, {
      params: {
        profile_id: auth.profile_id,
        profile_role: auth.profile_role,
        project_clientname: clientName, // Added where condition
      },
    })
      .then((response) => {
        const filteredData = response.data;
        setData(filteredData); // Update all projects data (for future filtering)
        setFinalData(filteredData); // Display filtered data
      })
      .catch((error) => console.error(error));
      
  };

  // Filter data based on the selected project
  const handleProjectChange = (projectName) => {
    setSelectedProject(projectName);

    const filteredData = data.filter(item => 
      item.project_clientname === selectedClient && item.project_name === projectName
    );
    setFinalData(filteredData); // Display only filtered data
  };

  // Reset filters and show all data
  const resetFilters = () => {
    setSelectedClient(null);
    setSelectedProject(null);
    setFinalData(data); // Reset to full data
  };

  useEffect(() => {
    getProjectsClients(); // Fetch all data on component mount
  }, []);

  return (
    <div>
      {/* Client and Project Dropdowns */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Client 
          pname="Select Client" 
          selectedClient={selectedClient}
          onChange={handleClientChange}
        />
        <Project 
          pname="Select Project" 
          selectedClient={selectedClient}
          selectedProject={selectedProject}
          onChange={handleProjectChange}
        />
        <Button onClick={resetFilters}>Clear Filters</Button>
      </div>

      {/* Data Table */}
      <Table
        columns={columnsRow}
        dataSource={finalData}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default FilterData;