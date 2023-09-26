import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, Table } from 'antd';
import 'antd/dist/antd.min.css';
import { DOMAIN } from '../Constant';
import ProfileDataManager from './ProfileDataManager';

const { Option } = Select;

  const ProfileData = () => {
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedManagerDetails, setSelectedManagerDetails] = useState(null);

  useEffect(() => {
    axios
      .get(`${DOMAIN}/allprofiles`)
      .then(response => {
        const managerProfiles = response.data.filter(item => item.profile_role === 2);
        setManagers(managerProfiles);
      })
      .catch(error => console.error(error));
  }, []);

  const handleManagerChange = (value) => {
    const manager = managers.find(manager => manager.profile_fullname === value);
    setSelectedManager(manager);
  };

 
useEffect(() => {
  if (selectedManager) {
    axios
      .get(`${DOMAIN}/allprojects`)
      .then(response => {
        const allProjects = response.data;
        console.log(response.data)
        const assignedProjectIds = (selectedManager.project_id || '').split(',').map(projectId => projectId.trim());
        console.log("projectids:", assignedProjectIds)
        const assignedProjects = assignedProjectIds.map(projectId => {
            const project = allProjects.find(project => project.project_id.toString() === projectId);

          return project ? project.project_Name : '';
        });
        console.log("Assigned Projects:", assignedProjects);
        setSelectedManagerDetails({ ...selectedManager, assignedProjects });
      })
      .catch(error => {
        console.error(error);
        setSelectedManagerDetails({ ...selectedManager, assignedProjects: [] });
      });
  } else {
    setSelectedManagerDetails(null);
  }
}, [selectedManager]);

  const columns = [
    {
      title: "Manager's Full Name",
      dataIndex: 'profile_fullname',
      key: 'profile_fullname',
    },
    {
      title: 'Username',
      dataIndex: 'profile_username',
      key: 'profile_username',
    },
    {
      title: 'Assigned Projects',
      dataIndex: 'assignedProjects',
      key: 'assignedProjects',
      render: (assignedProjects) => (
        <span>{assignedProjects.join(',')}</span>
      ),
    },
  ];
  return (
    <div>
      <Select
        placeholder="Select a Manager"
        onChange={handleManagerChange}
        style={{ width: 200, marginBottom: 16 }}
      >
        {managers.map(manager => (
          <Option key={manager.profile_username} value={manager.profile_fullname}>
            {manager.profile_fullname}
          </Option>
        ))}
      </Select>
      <Table
        columns={columns}
        dataSource={selectedManagerDetails ? [selectedManagerDetails] : []}
        pagination={false}
      />
    </div>
  );
};

export default ProfileData;
