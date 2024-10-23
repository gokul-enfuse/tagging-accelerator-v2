import React, { useState } from 'react';
import Toggle from 'react-bootstrap-toggle';
import { alpha, styled } from '@mui/material/styles';
import { pink, green } from '@mui/material/colors';
import Switch from '@mui/material/Switch';
import axios from 'axios';
import { DOMAIN } from '../Constant.js';
import Swal from 'sweetalert2';

const GreenSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: green[600],
      '&:hover': {
        backgroundColor: alpha(green[600], theme.palette.action.hoverOpacity),
      },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: green[600],
    },
  }));
  
const label = { inputProps: { 'aria-label': 'Color switch demo' } };

export const ToggleComponent = () => {
  const [active, setActive] = useState(false);

  return (
    <div>
      <Toggle
        onClick={() => setActive(!active)}
        on="Enabled"
        off="Disabled"
        active={active}
      />
    </div>
  );
}

export const ColorSwitches = ({hours, profileId}) => {
  const [checked, setChecked] = useState(true);
  const handleChange = (event) => {
    setChecked(event.target.checked);
    if(checked) {
       axios.put(`${DOMAIN}/logout/${profileId}`, {profil_login_session: 0})
        .then(res => {
            console.log(res)
            showAlert('Success', res.message, 'success');
        }).catch(error => {
            console.log(error);
            showAlert('Info', error, 'error');
        });
    }
  };
  const showAlert = (title, mess, icons) => {
    Swal.fire({
      title: title,
      text: mess,
      icon: icons,
      confirmButtonText: 'OK',
    });
  };
  
  return (
    <div>
      {/* {parseFloat(hours) > 0 ?
        <GreenSwitch {...label} 
        checked={checked}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'controlled' }}/> : <GreenSwitch {...label} />
      } */}
      <GreenSwitch {...label} 
        checked={parseFloat(hours) > 0 ? checked : ''}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'controlled' }}/>
    </div>
  );
}
