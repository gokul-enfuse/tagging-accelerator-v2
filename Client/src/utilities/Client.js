import React, {useState, useEffect} from "react";
import axios from "axios";
import useAuth from '../hooks/useAuth.js';
import { DOMAIN } from '../Constant.js';

export function Client({ pname, selectedClient, onChange }) {
  const [clients, setClients] = useState([]);

  // Fetch clients
  useEffect(() => {
    axios.post(`${DOMAIN}/getclients`)
      .then(res => setClients(res.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <select
      name="client"
      id="client"
      value={selectedClient || ""}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: '150px', height: '30px' }}
    >
      <option value="" disabled>Select Client</option>
      {clients.map(client => (
        <option key={client.project_clientname} value={client.project_clientname}>
          {client.project_clientname}
        </option>
      ))}
    </select>
  );
}
